
const amqp = require('amqplib');
const axios = require('axios');
const connectDB = require('../data/db');

const HF_TOKEN = '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';

async function start() {
  await connectDB();
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
  const channel = await conn.createChannel();
  await channel.assertQueue('text_analysis_queue', { durable: true });

  channel.consume('text_analysis_queue', async (msg) => {
    const content = JSON.parse(msg.content.toString());
    let textResult = {};
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/ProsusAI/finbert',
        { inputs: content.text },
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const prediction = response.data[0];
      textResult = {
        label: prediction.label,
        score: prediction.score
      };
    } catch (err) {
      console.error('Error en Hugging Face:', err.message);
      textResult = { error: 'Fallo en análisis de texto' };
    }

    const result = {
      id: content.id,
      titulo: content.title,
      type: 'text',
      result: {
        label: prediction.label,
        score: prediction.score
  }
    };

    await channel.assertQueue('result_integration_queue', { durable: true });
    channel.sendToQueue('result_integration_queue', Buffer.from(JSON.stringify(result)), { persistent: true });
    channel.ack(msg);
  });
}

start();

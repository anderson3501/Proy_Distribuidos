const amqp = require('amqplib');

async function sendToQueues(noticia) {
  try {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const textQueue = 'text_analysis_queue';
    const imageQueue = 'image_analysis_queue';

    await channel.assertQueue(textQueue, { durable: true });
    await channel.assertQueue(imageQueue, { durable: true });

    const msg = JSON.stringify(noticia);

    channel.sendToQueue(textQueue, Buffer.from(msg), { persistent: true });
    channel.sendToQueue(imageQueue, Buffer.from(msg), { persistent: true });

    console.log(`Noticia enviada a colas: ${textQueue} y ${imageQueue}`);
  } catch (err) {
    console.error('Error al enviar a RabbitMQ:', err.message);
  }
}

module.exports = sendToQueues;

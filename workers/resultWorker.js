const amqp = require('amqplib');
const mongoose = require('mongoose');
const Resultado = require('../models/Resultado');

(async () => {
  await mongoose.connect('mongodb://mongo:27017/notihelp');

  const conn = await amqp.connect('amqp://rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertQueue('result_integration_queue', { durable: true });

  ch.consume('result_integration_queue', async (msg) => {
    const data = JSON.parse(msg.content.toString());

    const nuevo = {
      id: data.id,
      titulo: data.title || 'Sin título' ,
      tipo: data.type,
      fechaEnvio: new Date(),
      resultado: data.result || {}
    };

    await Resultado.create(nuevo);
    console.log('Resultado guardado:', nuevo);
    ch.ack(msg);
  });
})();


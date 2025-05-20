
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('text_analysis_queue', { durable: true });
        await channel.assertQueue('image_queue', { durable: true });
        console.log('Conexion a RabbitMQ esxtablecida - colas listas');
    } catch (error) {
        console.error('Error al establecer la conexion a RabbitMQ:', error);
    }
}

function sendToQueue(queue, message) {
    if (channel) {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    } else {
        console.error('Canal RabbitMQ no inicializado');
    }
}

module.exports = { connectRabbitMQ, sendToQueue };

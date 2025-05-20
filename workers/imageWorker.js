
const amqp = require('amqplib');
const fs = require('fs');
const https = require('https');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

async function downloadImage(url, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(outputPath, () => reject(err));
        });
    });
}

function hashImageBuffer(buffer) {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
}

async function startImageWorker() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
    const channel = await conn.createChannel();
    await channel.assertQueue('image_queue', { durable: true });
    await channel.assertQueue('result_integration_queue', { durable: true });

    channel.consume('image_queue', async (msg) => {
        const content = JSON.parse(msg.content.toString());
        const result = {
            id: content.id,
            title: content.title,
            type: 'image',
            result: {}
        };

        const tempPath = path.join(__dirname, 'temp_image.jpg');

        try {
            await downloadImage(content.image, tempPath);
            const buffer = await sharp(tempPath).resize(256, 256).toBuffer();
            const hash = hashImageBuffer(buffer);
            const isManipulated = hash.startsWith('0000');

            result.result = { hash, manipulated: isManipulated };
        } catch (err) {
            result.result = { error: 'Error al procesar la imagen' };
            console.error('Error en imageWorker:', err.message);
        } finally {
            fs.existsSync(tempPath) && fs.unlinkSync(tempPath);
        }

        channel.sendToQueue('result_integration_queue', Buffer.from(JSON.stringify(result)), { persistent: true });
        channel.ack(msg);
    });
}

startImageWorker();

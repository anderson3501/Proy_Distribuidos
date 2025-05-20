
const Resultado = require('../models/Resultado');
const amqp = require('amqplib');
const getNextId = require('../utils/getNextId');

async function enviarNoticia(req, res) {
  try {
    const { title, text, image = '' } = req.body;
    const id = await getNextId();

    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
    const channel = await connection.createChannel();

    const noticia = { id, title, text, image };

    await channel.assertQueue('text_analysis_queue', { durable: true });
    await channel.assertQueue('image_queue', { durable: true });

    channel.sendToQueue('text_analysis_queue', Buffer.from(JSON.stringify(noticia)), { persistent: true });
    channel.sendToQueue('image_queue', Buffer.from(JSON.stringify(noticia)), { persistent: true });

    res.send('<h2>Noticia enviada correctamente.</h2><p><a href="/">Volver al inicio</a></p>');
  } catch (error) {
    console.error('Error al enviar noticia:', error.message);
    res.status(500).send('Error al enviar la noticia');
  }
}

async function listarNoticias(req, res) {
  try {
    const noticias = await Resultado.find().sort({ id: 1 });

    let html = '<h1>Noticias Registradas</h1>';
    html += '<table border="1"><tr><th>ID</th><th>Título</th><th>Fecha</th><th>Tipo</th><th>Resultado</th></tr>';

    for (const noticia of noticias) {
      const resultado = JSON.stringify(noticia.resultado || {}, null, 2);
      html += `<tr>
        <td><a href="/news/${noticia.id}">${noticia.id}</a></td>
        <td>${noticia.titulo}</td>
        <td>${new Date(noticia.fechaEnvio).toLocaleString()}</td>
        <td>${noticia.tipo || 'completo'}</td>
        <td><pre>${resultado}</pre></td>
      </tr>`;
    }

    html += '</table><p><a href="/">Volver al inicio</a></p>';
    res.send(html);
  } catch (error) {
    console.error('Error listando noticias:', error.message);
    res.status(500).send('Error al listar noticias');
  }
}

async function mostrarFormulario(req, res) {
  res.sendFile(require('path').resolve(__dirname, '../public/form.html'));
}

async function verNoticiaPorId(req, res) {
  try {
    const noticia = await Resultado.findOne({ id: parseInt(req.params.id) });

    if (!noticia) return res.status(404).send('Noticia no encontrada');

    let html = `<h1>Noticia #${noticia.id}</h1>`;
    html += `<p><strong>Título:</strong> ${noticia.titulo}</p>`;
    html += `<p><strong>Fecha:</strong> ${new Date(noticia.fechaEnvio).toLocaleString()}</p>`;
    html += `<p><strong>Resultado:</strong><pre>${JSON.stringify(noticia.resultado || {}, null, 2)}</pre></p>`;
    html += '<p><a href="/news">Volver a noticias</a></p>';

    res.send(html);
  } catch (error) {
    res.status(500).send('Error al obtener la noticia');
  }
}

module.exports = {
  enviarNoticia,
  listarNoticias,
  mostrarFormulario,
  verNoticiaPorId
};


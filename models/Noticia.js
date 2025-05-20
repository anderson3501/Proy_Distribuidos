const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  titulo: { type: String, required: true },
  texto: { type: String, required: true },
  imagen: { type: String, required: true },
  url: { type: String, required: true },
  fecha_envio: { type: Date, default: Date.now },
  estado: { type: String, default: 'pendiente' }
});

module.exports = mongoose.model('Noticia', noticiaSchema);

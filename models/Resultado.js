
const mongoose = require('mongoose');

const resultadoSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: String,
    textResult: Object,
    imageResult: Object,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resultado', resultadoSchema);

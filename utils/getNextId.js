
const Resultado = require('../models/Resultado');

async function getNextId() {
  const last = await Resultado.findOne().sort({ id: -1 });
  return last ? last.id + 1 : 1;
}

module.exports = getNextId;


const mongoose = require('mongoose');

async function connectDB(uri = process.env.MONGO_URL || 'mongodb://mongo:27017/notihelp') {
  let connected = false;
  let attempts = 5;

  while (!connected && attempts > 0) {
    try {
      await mongoose.connect(uri);
      console.log('Conectado a MongoDB');
      connected = true;
    } catch (err) {
      console.log(`Intento fallido de conexión a MongoDB. Reintentos restantes: ${attempts - 1}`);
      attempts--;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  if (!connected) {
    console.error('No se pudo conectar a MongoDB tras múltiples intentos.');
    process.exit(1);
  }
}

module.exports = connectDB;

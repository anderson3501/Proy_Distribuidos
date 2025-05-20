
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./data/db');
const app = express();
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos HTML
app.use(express.static('public'));

// Rutas
const newsRoutes = require('./routes/newsRoutes');
app.use(newsRoutes);

// Página principal (sirve index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar conexión y servidor
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
});

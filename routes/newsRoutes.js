const express = require('express');
const router = express.Router();
const {
  enviarNoticia,
  listarNoticias,
  mostrarFormulario,
  verNoticiaPorId
} = require('../controllers/newsController');

router.get('/news', listarNoticias);
router.get('/news/form', mostrarFormulario);
router.get('/news/:id', verNoticiaPorId);
router.post('/news', enviarNoticia);  // esta debe ser una función válida

module.exports = router;


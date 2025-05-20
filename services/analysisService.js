const db = require('../data/db');

exports.analyze = (id, title, content, image, url) => {
  setTimeout(() => {
    db.news[id].status = 'done';
    db.news[id].result = {
      text_classification: "Política",
      image_classification: "Evento público",
      veracity: "Veraz",
      explanation: "El contenido coincide con fuentes verificadas."
    };
  }, 5000);
};

const mongoose = require('mongoose');

const FilmeSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  ano: Number,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Filme', FilmeSchema);


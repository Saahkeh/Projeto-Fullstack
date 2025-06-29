const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

UsuarioSchema.pre('save', async function () {
  this.senha = await bcrypt.hash(this.senha, 10);
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

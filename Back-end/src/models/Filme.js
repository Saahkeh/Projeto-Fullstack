import mongoose from 'mongoose';

const FilmeSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  ano: Number,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

export default mongoose.model('Filme', FilmeSchema);



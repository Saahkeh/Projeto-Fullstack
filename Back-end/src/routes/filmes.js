import express from 'express';
import jwt from 'jsonwebtoken';
import Filme from '../models/Filme.js';
import { body, validationResult } from 'express-validator';
import logger from '../../logs/logger.js';

const router = express.Router();

// Middleware para autenticar token JWT
const autenticar = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

// POST /api/filmes
router.post('/',
  autenticar,
  [
    body('titulo').notEmpty().withMessage('Título obrigatório'),
    body('genero').notEmpty().withMessage('Gênero obrigatório'),
    body('ano').isInt({ min: 1900 }).withMessage('Ano inválido')
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { titulo, genero, ano } = req.body;

    try {
      const filme = new Filme({ titulo, genero, ano, usuario: req.usuarioId });
      await filme.save();
      logger.info('Filme cadastrado', { titulo, genero, ano });
      res.status(201).json(filme);
    } catch (err) {
      logger.error('Erro ao salvar filme', { erro: err.message });
      res.status(500).json({ erro: 'Erro ao salvar o filme', detalhe: err.message });
    }
  }
);

// GET /api/filmes
router.get('/', autenticar, async (req, res) => {
  try {
    const filmes = await Filme.find({ usuario: req.usuarioId });
    logger.info('Filmes listados', { quantidade: filmes.length });
    res.json(filmes);
  } catch (err) {
    logger.error('Erro ao buscar filmes', { erro: err.message });
    res.status(500).json({ erro: 'Erro ao buscar filmes', detalhe: err.message });
  }
});

// DELETE /api/filmes/:id
router.delete('/:id', autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const filme = await Filme.findOneAndDelete({ _id: id, usuario: req.usuarioId });
    if (!filme) {
      return res.status(404).json({ erro: 'Filme não encontrado ou não pertence a este usuário' });
    }

    logger.info('Filme excluído', { id });
    res.status(204).end();
  } catch (err) {
    logger.error('Erro ao excluir filme', { erro: err.message });
    res.status(500).json({ erro: 'Erro ao excluir filme', detalhe: err.message });
  }
});

export default router;

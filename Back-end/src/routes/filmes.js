const express = require('express');
const Filme = require('../models/Filme');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

router.post('/', autenticar, async (req, res) => {
  const filme = new Filme({ ...req.body, usuario: req.usuarioId });
  await filme.save();
  res.json(filme);
});

router.get('/', autenticar, async (req, res) => {
  const filmes = await Filme.find({ usuario: req.usuarioId });
  res.json(filmes);
});

module.exports = router;

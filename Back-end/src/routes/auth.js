import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Usuario from '../models/usuario.js';
import logger from '../../logs/logger.js';

const router = express.Router();

// === POST /api/auth/login ===
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha obrigatória'),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { email, senha } = req.body;

    try {
      const usuario = await Usuario.findOne({ email });
      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        logger.warn('Login falhou', { email });
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      logger.info('Login bem-sucedido', { email });
      res.status(200).json({ token });
    } catch (err) {
      logger.error('Erro interno ao realizar login', { erro: err.message });
      res.status(500).json({
        erro: 'Erro interno ao realizar login',
        detalhe: err.message,
      });
    }
  }
);

// === POST /api/auth/register ===
router.post(
  '/register',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { nome, email, senha } = req.body;

    try {
      const existente = await Usuario.findOne({ email });
      if (existente) {
        return res.status(409).json({ erro: 'Email já cadastrado' });
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const usuario = new Usuario({ nome, email, senha: senhaCriptografada });
      await usuario.save();

      logger.info('Novo usuário registrado', { email });
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (err) {
      logger.error('Erro ao registrar usuário', { erro: err.message });
      res.status(500).json({
        erro: 'Erro ao registrar usuário',
        detalhe: err.message,
      });
    }
  }
);

export default router;

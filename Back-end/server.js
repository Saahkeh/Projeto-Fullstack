import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from './logs/logger.js';

import authRoutes from "./src/routes/auth.js";
import filmeRoutes from './src/routes/filmes.js';

dotenv.config();
const app = express();

// Segurança e performance
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(morgan("combined"));

// Logger customizado
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Limite de requisições
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { erro: "Muitas requisições. Tente novamente em breve." }
});
app.use(limiter);

// Middleware de cache
app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=60");
  next();
});

// Banco de dados
mongoose.connect("mongodb://localhost:27017/filmes", {
  maxPoolSize: 10
}).then(() => logger.info("MongoDB conectado"))
  .catch(err => logger.error("Erro Mongo:", err));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/filmes", filmeRoutes);

// Rota de fallback
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// HTTPS com certificado local
const key = fs.readFileSync("./cert/server.key");
const cert = fs.readFileSync("./cert/server.cert");

https.createServer({ key, cert }, app).listen(5000, () => {
  logger.info("Servidor HTTPS rodando na porta 5000");
});

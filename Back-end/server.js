const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const filmeRoutes = require('./src/routes/filmes');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/filmes', filmeRoutes);

app.listen(5000, () => console.log('Servidor rodando na porta 5000'));

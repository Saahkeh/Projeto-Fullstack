import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Garante caminho absoluto mesmo com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo de log
const logPath = path.join(__dirname, 'app.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: logPath }),
    new winston.transports.Console()
  ]
});

export default logger;



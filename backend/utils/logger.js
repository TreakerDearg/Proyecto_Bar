import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

// Formato para consola (bonito)
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Rotación de archivos
const fileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: "logs",
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

// Archivo exclusivo de errores
const errorRotateTransport = new winston.transports.DailyRotateFile({
  dirname: "logs",
  filename: "error-%DATE%.log",
  level: "error",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d",
});

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    consoleFormat
  ),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), consoleFormat) }),
    fileRotateTransport,
    errorRotateTransport
  ],
});

export default logger;

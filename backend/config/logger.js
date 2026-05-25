import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

export const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  const logEntry = {
    timestamp,
    level,
    message,
    data,
  };

  console.log(logMessage, data);

  // Write to file
  const logFile = path.join(logsDir, `${level.toLowerCase()}-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

export const logInfo = (message, data) => log('info', message, data);
export const logError = (message, data) => log('error', message, data);
export const logWarn = (message, data) => log('warn', message, data);
export const logDebug = (message, data) => log('debug', message, data);

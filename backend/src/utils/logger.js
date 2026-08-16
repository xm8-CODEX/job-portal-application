const levels = { info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' };
const reset = '\x1b[0m';

const log = (level, message, meta) => {
  const color = levels[level] || '';
  const timestamp = new Date().toISOString();
  console.log(`${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`, meta || '');
};

module.exports = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
};

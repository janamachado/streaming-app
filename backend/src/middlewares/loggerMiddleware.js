const morgan = require('morgan');
const logger = require('../config/logger');

// Função para formatar objetos de forma segura
const formatObject = (obj) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return '[Não foi possível serializar o objeto]';
  }
};

// Formato personalizado para o morgan com body
morgan.token('custom', (req) => {
  const bodyLog = Object.keys(req.body).length ? `\nBody: ${formatObject(req.body)}` : '';
  return `${req.method} ${req.url}${bodyLog}`;
});

// Criar um stream personalizado para o morgan
const stream = {
  write: (message) => logger.info(message.trim())
};

// Middleware de log para requisições HTTP
const httpLogger = morgan(':custom', { stream });

// Middleware para logs de sucesso
const successLogger = (req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    const responseLog = `${req.method} ${req.url}\nStatus: ${res.statusCode}\nResponse: ${formatObject(data)}`;
    logger.info(responseLog);
    return oldJson.call(this, data);
  };
  next();
};

// Middleware para logs de erro
const errorLogger = (err, req, res, next) => {
  const errorLog = `${req.method} ${req.url}\nStatus: ${err.status || 500}\nError: ${err.message}\nBody: ${formatObject(req.body)}`;
  logger.error(errorLog);
  next(err);
};

module.exports = {
  httpLogger,
  successLogger,
  errorLogger
};

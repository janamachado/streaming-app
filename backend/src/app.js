require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const songRoutes = require('./routes/song.routes');
const playlistRoutes = require('./routes/playlist.routes');
const deezerRoutes = require('./routes/deezer.routes');
const errorHandler = require('./middlewares/errorHandler');
const { httpLogger, successLogger, errorLogger } = require('./middlewares/loggerMiddleware');
const logger = require('./config/logger');

const app = express();

// Body parsing middlewares first
app.use(cors());
app.use(express.json());

// Logging middlewares
app.use(httpLogger);
app.use(successLogger);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/song', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/deezer', deezerRoutes);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const songRoutes = require('./routes/song.routes');
const playlistRoutes = require('./routes/playlist.routes');
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

// Routes
app.use('/api/song', songRoutes);
app.use('/api/playlists', playlistRoutes);

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

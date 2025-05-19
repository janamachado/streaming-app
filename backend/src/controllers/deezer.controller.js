const deezerService = require('../services/deezer.service');

class DeezerController {
  async search(req, res, next) {
    try {
      const { query = '', limit = 100 } = req.query;
      const tracks = await deezerService.searchTracks(query, Math.min(limit, 50));
      res.json(tracks);
    } catch (error) {
      next(error);
    }
  }

  async getTopTracks(req, res, next) {
    try {
      const { limit = 100 } = req.query;
      const tracks = await deezerService.getTopTracks(Math.min(limit, 50));
      res.json(tracks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeezerController();

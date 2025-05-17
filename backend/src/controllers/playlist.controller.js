const playlistService = require('../services/playlist.service');

class PlaylistController {
  async create(req, res, next) {
    try {
      const playlist = await playlistService.create(req.body);
      res.status(201).json(playlist);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const playlists = await playlistService.findAll();
      res.json(playlists);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const playlist = await playlistService.findOne(parseInt(req.params.id));
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const playlist = await playlistService.update(parseInt(req.params.id), req.body);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await playlistService.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaylistController();

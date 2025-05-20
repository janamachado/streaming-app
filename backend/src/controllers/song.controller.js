const songService = require('../services/song.service');

class SongController {
  async create(req, res, next) {
    try {
      const song = await songService.create(req.body);
      res.status(201).json(song);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const songs = await songService.findAll();
      res.json(songs);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const song = await songService.findOne(parseInt(req.params.id));
      res.json(song);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const song = await songService.update(parseInt(req.params.id), req.body);
      res.json(song);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await songService.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SongController();

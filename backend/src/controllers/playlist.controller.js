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
      const filters = {
        name: req.query.name,
        songId: req.query.songId
      };
      const playlists = await playlistService.findAll(filters);
      res.json(playlists);
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { query } = req.query;
      
      if (!query) {
        throw { type: 'ValidationError', message: 'Search query is required' };
      }

      const playlists = await playlistService.search(query);
      res.json(playlists);
    } catch (error) {
      next(error);
    }
  }

  async findPlaylistsBySong(req, res, next) {
    try {
      const { song } = req.query;
      
      if (!song) {
        throw { type: 'ValidationError', message: 'Song query (ID or title) is required' };
      }

      const playlists = await playlistService.findPlaylistsBySong(song);
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

  async addSongs(req, res, next) {
    try {
      const playlistId = parseInt(req.params.id);
      const { songIds } = req.body;
      
      if (!Array.isArray(songIds) || songIds.length === 0) {
        throw { type: 'ValidationError', message: 'songIds must be a non-empty array' };
      }

      const playlist = await playlistService.addSongs(playlistId, songIds);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }

  async removeSongs(req, res, next) {
    try {
      const playlistId = parseInt(req.params.id);
      const { songIds } = req.body;
      
      if (!Array.isArray(songIds) || songIds.length === 0) {
        throw { type: 'ValidationError', message: 'songIds must be a non-empty array' };
      }

      const playlist = await playlistService.removeSongs(playlistId, songIds);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaylistController();

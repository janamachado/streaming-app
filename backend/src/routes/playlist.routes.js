const router = require('express').Router();
const playlistController = require('../controllers/playlist.controller');

router.post('/', playlistController.create);
router.get('/search', playlistController.search);
router.get('/by-song', playlistController.findPlaylistsBySong);
router.get('/', playlistController.findAll);
router.get('/:id', playlistController.findOne);
router.put('/:id', playlistController.update);
router.delete('/:id', playlistController.delete);
router.post('/:id/songs', playlistController.addSongs);
router.delete('/:id/songs', playlistController.removeSongs);

module.exports = router;

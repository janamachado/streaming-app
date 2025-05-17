const router = require('express').Router();
const playlistController = require('../controllers/playlist.controller');

router.post('/', playlistController.create);
router.get('/', playlistController.findAll);
router.get('/:id', playlistController.findOne);
router.put('/:id', playlistController.update);
router.delete('/:id', playlistController.delete);

module.exports = router;

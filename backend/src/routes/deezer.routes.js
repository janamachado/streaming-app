const router = require('express').Router();
const deezerController = require('../controllers/deezer.controller');

router.get('/search', deezerController.search);
router.get('/top', deezerController.getTopTracks);

module.exports = router;

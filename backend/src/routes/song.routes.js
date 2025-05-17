const router = require('express').Router();
const songController = require('../controllers/song.controller');

router.post('/', songController.create);
router.get('/', songController.findAll);
router.get('/:id', songController.findOne);
router.put('/:id', songController.update);
router.delete('/:id', songController.delete);

module.exports = router;

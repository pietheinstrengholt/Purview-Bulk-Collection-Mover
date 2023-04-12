const express = require('express');
const collectionController = require('../controllers/collection.js');
const router = express.Router();

// /api/collections
router.get('/', collectionController.getCollections);
router.post('/discover', collectionController.discoverCollection)

module.exports = router;
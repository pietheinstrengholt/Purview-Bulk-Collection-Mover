const express = require('express');
const entityController = require('../controllers/entity.js');
const router = express.Router();

// GET /api/collections
router.get('/', entityController.getEntities);

module.exports = router;
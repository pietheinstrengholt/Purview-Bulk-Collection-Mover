const express = require('express');
const entityController = require('../controllers/entity.js');
const router = express.Router();

// /api/entities
router.post('/move', entityController.moveEntities);

module.exports = router;
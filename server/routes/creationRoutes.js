const express = require('express');
const router = express.Router();
const creationController = require('../controllers/creationController');
const { requireAuth } = require('../middleware/auth');

// All creation endpoints require authentication (Section 21.2)
router.use(requireAuth);

router.post('/generate', creationController.generateCreation);
router.get('/', creationController.listCreations);
router.get('/:id', creationController.getCreation);
router.put('/:id', creationController.updateCreation);
router.post('/:id/regenerate', creationController.regenerateCreation);
router.delete('/:id', creationController.deleteCreation);

module.exports = router;

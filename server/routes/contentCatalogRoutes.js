const express = require('express');
const router = express.Router();
const contentCatalogController = require('../controllers/contentCatalogController');

router.get('/categories', contentCatalogController.listCategories);
router.get('/', contentCatalogController.listContentTypes);
router.get('/:id', contentCatalogController.getContentType);

module.exports = router;

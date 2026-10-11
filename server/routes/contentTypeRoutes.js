const router = require('express').Router();
const { catalog } = require('../config/contentTypes');

router.get('/', (req, res) => res.json({ success: true, ...catalog() }));

module.exports = router;

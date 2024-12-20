const express = require('express');
const router = express.Router();

// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/comics'

// GET /comics (index functionality) UN-PROTECTED - all users can access
router.get('/', (req, res) => {
  res.send('Rejoice - the comics are here!');
});

// GET /comics/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.send('Add a unicorn!');
});



module.exports = router;
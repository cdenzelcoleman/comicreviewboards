const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');

// Middleware 
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/comics'

// GET /comics (index functionality) UN-PROTECTED - all users can access
router.get('/', async (req, res) => {
  try{
    const comics = await comic.find().populate('owner').exec();
    res.render('comics/index.ejs', { comics, user: req.user});
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET /comics/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.render('comics/new.ejs', {user: req.user});
});

// add new comic
router.post('/', ensureSignedIn, async (req, res) => {
try {
  const newComic = await comic.create ({
    ...req.body,
    owner: req.user._id,
  });
  req.user.comic.push(newComic._id);
  await req.user.save();
  res.redirect('/comics');
} catch (err) {
  console.error(err);
  res.redirect('/comics/new');
}
});
// show comic details
router.get('/:id', async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id).populate('owner comments.author');
    res.render('comic/show.ejs', { comic, user: req.user});
  } catch (err) {
    console.error(err);
    res.redirect('/comics');
  }
});



module.exports = router;
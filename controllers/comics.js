const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');

// Middleware 
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/comics'

// GET /comics (index functionality) UN-PROTECTED - all users can access
router.get('/', async (req, res) => {
  try{
    const comics = await Comic.find().populate('owner').exec();
    res.render('comics/index.ejs', { comics, user: req.user, title: ''});
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET /comics/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.render('comics/new.ejs', { user: req.user, title: '' });
});

// add new comic
router.post('/', ensureSignedIn, async (req, res) => {
try {
  const newComic = await Comic.create ({
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
    res.render('comic/show.ejs', { comic, user: req.user, title: ''});
  } catch (err) {
    console.error(err);
    res.redirect('/comics');
  }
});
// comic edit
router.get('/:id/edit', ensureSignedIn, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic.owner.equals(req.user._id))
      return res.redirect('/comics');
    res.render('comic/edit.ejs', { comic, user: req.user, title: ''});
  } catch (err) {
    console.error(err);
    res.redirect('/comics');
    
  }
});
// update comic
router.put('/:id', ensureSignedIn, async (req,res) => {
  try{
    const comic = await Comic.findById(req.params.id);
    if(!comic.owner.equals(req.user._id)) return res.redirect('comics');
    Object.assign(comic, req.body);
    await comic.save();
    res.redirect('comics/${comic._id');
  } catch (err) {
    console.error(err);
    res.redirect('/comics');
  }
});
//delete
router.delete('/:id', ensureSignedIn, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if(!comic.owner.equals(req.user._id)) return res.redirect('comics');
    await comic.deleteOne();
    res.redirect('/comics');
  } catch (err) {
    console.error(err);
    res.redirect('/comics');
  }
})



module.exports = router;
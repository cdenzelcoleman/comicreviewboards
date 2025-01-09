const express = require("express");
const router = express.Router();
const Comic = require("../models/comic");

// Middleware
const ensureSignedIn = require("../middleware/ensure-signed-in");

// GET /comics - Supports search and pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const { search } = req.query;

  try {
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const comics = await Comic.paginate(query, { page, limit });

    res.render("comics/index.ejs", {
      comics: comics.docs,
      currentPage: comics.page,
      totalPages: comics.totalPages,
      user: req.user,
      title: "Comics",
      search,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// GET /comics/new - Render new comic form
router.get("/new", ensureSignedIn, (req, res) => {
  res.render("comics/new.ejs", { user: req.user, title: "" });
});

// POST /comics - Add new comic
router.post("/", ensureSignedIn, async (req, res) => {
  try {
    req.body.format =
      req.body.format?.trim() === "Comic Book" ? "Comicbook" : req.body.format;

    if (!["Trade Paperback", "Graphic Novel", "Comicbook"].includes(req.body.format)) {
      req.body.format = "Comicbook";
    }

    req.body.image = req.body.image?.match(/\.(jpg|jpeg|png|gif|svg)$/i)
      ? req.body.image
      : "https://i.imgur.com/OJnlOy8.jpeg";

    const { categories, rating, ...comicData } = req.body;
    const categoryArray = Array.isArray(categories) ? categories : [categories];

    const newComic = await Comic.create({
      ...comicData,
      categories: categoryArray,
      rating: rating || 0, 
      owner: req.user._id,
    });

    if (!req.user.comic) req.user.comic = [];
    req.user.comic.push(newComic._id);
    await req.user.save();

    res.redirect("/comics");
  } catch (err) {
    console.error(err);
    res.redirect("/comics/new");
  }
});

// GET /comics/new (new functionality) PROTECTED - only signed in users can access
router.get("/new", ensureSignedIn, (req, res) => {
  res.render("comics/new.ejs", { user: req.user, title: "" });
});

// add new comic
router.post("/", ensureSignedIn, async (req, res) => {
  try {
    req.body.format =
      req.body.format?.trim() === "Comic Book" ? "Comicbook" : req.body.format;

    if (
      !["Trade Paperback", "Graphic Novel", "Comicbook"].includes(
        req.body.format,
      )
    ) {
      req.body.format = "Comicbook";
    }

    req.body.image = req.body.image?.match(/\.(jpg|jpeg|png|gif|svg)$/i)
      ? req.body.image
      : "https://i.imgur.com/OJnlOy8.jpeg";

    const { categories, rating, ...comicData } = req.body;
    const categoryArray = Array.isArray(categories) ? categories : [categories];

    const newComic = await Comic.create({
      ...comicData,
      categories: categoryArray,
      rating: rating || 0, // Ensure rating is provided, default to 0 if not
      owner: req.user._id,
    });

    if (!req.user.comic) {
      req.user.comic = [];
    }

    req.user.comic.push(newComic._id);
    await req.user.save();
    res.redirect("/comics");
  } catch (err) {
    console.error(err);
    res.redirect("/comics/new");
  }
});

// show comic details
router.get("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id).populate(
      "owner comments.author",
    );
    res.render("comics/show.ejs", { comic, user: req.user, title: "" });
  } catch (err) {
    console.error(err);
    res.redirect("/comics");
  }
});

router.post("/:id/comments", ensureSignedIn, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) return res.redirect("/comics");
    comic.comments.push({ text: req.body.text, author: req.user._id });
    await comic.save();
    res.redirect(`/comics/${comic._id}`);
  } catch (err) {
    console.error(err);
    res.redirect("/comics");
  }
});

// comic edit
router.get("/:id/edit", ensureSignedIn, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic.owner.equals(req.user._id)) return res.redirect("/comics");
    res.render("comics/edit.ejs", { comic, user: req.user, title: "" });
  } catch (err) {
    console.error(err);
    res.redirect("/comics");
  }
});

// update comic
router.put("/:id", ensureSignedIn, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic.owner.equals(req.user._id)) return res.redirect("comics");
    Object.assign(comic, req.body);
    await comic.save();
    res.redirect(`/comics/${comic._id}`);
  } catch (err) {
    console.error(err);
    res.redirect("/comics");
  }
});

//delete
router.delete("/:id", ensureSignedIn, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic.owner.equals(req.user._id)) return res.redirect("comics");
    await comic.deleteOne();
    res.redirect("/comics");
  } catch (err) {
    console.error(err);
    res.redirect("/comics");
  }
});

module.exports = router;
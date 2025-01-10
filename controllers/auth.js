const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { title: "Sign Up!" });
});

router.post("/sign-up", async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword)
      throw new Error("Passwords do not match");
    req.body.password = bcrypt.hashSync(req.body.password, 6);
    const user = await User.create(req.body);
    req.session.user_id = user._id;
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.render("auth/sign-up.ejs", { title: "Sign Up!" });
  }
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { title: "Sign In" });
});

router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new Error("Invalid username");
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) throw new Error("Invalid password");
    req.session.user_id = user._id;
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.render("auth/sign-in.ejs", { title: "Sign In" });
  }
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

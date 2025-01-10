const User = require("../models/user");

module.exports = async function (req, res, next) {
  req.user = req.session.user_id
    ? await User.findById(req.session.user_id)
    : null;
  res.locals.user = req.user;
  next();
};

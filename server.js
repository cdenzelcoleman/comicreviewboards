require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const comicsController = require("./controllers/comics");
const apiController = require("./controllers/api");
const Comic = require("./models/comic"); 


const app = express();
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// Middleware
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(require("./middleware/add-user-to-locals-and-req"));

// Routes
app.get("/", async (req, res) => {
  try {
      const randomComics = await Comic.aggregate([{ $sample: { size: 4 } }]);
    res.render("home.ejs", { comics: randomComics, title: "Home Page" });
  } catch (err) {
    console.error(err);
    res.render("home.ejs", { comics: [], title: "Home Page" }); 
    }
});

app.use("/auth", require("./controllers/auth"));
app.use("/comics", require("./controllers/comics"));
app.use("/api", apiController);

// ALL routes protected by the ensureSignedIn middleware
app.use(require("./middleware/ensure-signed-in"));
app.use("/comics", comicsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

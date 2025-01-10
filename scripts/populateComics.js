require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Comic = require("../models/comic");

const API_BASE_URL = "https://comicvine.gamespot.com/api";
const API_KEY = process.env.COMIC_VINE_API_KEY;

const validCategories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const response = await axios.get(`${API_BASE_URL}/issues`, {
      params: {
        api_key: API_KEY,
        format: "json",
        sort: "date_added:desc",
        limit: 100,
        field_list: "name,description,image,origin,powers,publisher,teams",
      },
    });

    const comics = response.data.results
      .filter((comic) => comic.image && comic.name)
      .map((comic) => ({
        title: comic.name || "Untitled",
        description: comic.deck || "No description available.",
        categories: [
          validCategories[Math.floor(Math.random() * validCategories.length)],
        ],
        rating: Math.floor(Math.random() * 5) + 1,
        format: "Comicbook",
        image: comic.image?.original_url || "https://i.imgur.com/LvIGBo7.png",
        origin: comic.origin?.name || "Unknown",
        powers: comic.powers?.map((power) => power.name) || [],
        publisher: comic.publisher?.name || "Unknown",
        teams: comic.teams?.map((team) => team.name) || [],
        realName: comic.real_name || "Unknown",
        firstAppearance: comic.first_appeared_in_issue?.name || "Unknown",
        owner: "67806e8e3623c4c0b38760f8",
      }));

    await Comic.insertMany(comics);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();

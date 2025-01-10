const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE_URL = "https://comicvine.gamespot.com/api";
const API_KEY = process.env.COMIC_VINE_API_KEY;

router.get("/comics", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${API_BASE_URL}/issues`, {
      params: {
        api_key: API_KEY,
        format: "json",
        filter: query ? `name:${query}` : "",
      },
    });
    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error("Error fetching comics from API:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comics." });
  }
});

router.get("/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/issues/${id}`, {
      params: {
        api_key: API_KEY,
        format: "json",
      },
    });
    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error("Error fetching comic details:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comic details." });
  }
});

module.exports = router;

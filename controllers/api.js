const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.COMIC_VINE_API_KEY || 'c69914b2348593fd0dfeeb4ef47532b1afef5587';
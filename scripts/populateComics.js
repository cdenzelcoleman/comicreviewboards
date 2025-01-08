require("dotenv").config();
const mongoose = require('mongoose');
const axios = require('axios');
const Comic = require('../models/comic');

const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.COMIC_VINE_API_KEY;

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Fetch data from the API
        const API_URL = `${API_BASE_URL}/issues`;
        const response = await axios.get(API_URL, {
            params: {
                api_key: API_KEY,
                format: 'json',
            },
        });

        // Transform API data to match the schema
        const comics = response.data.results.map(comic => ({
            title: comic.name || 'Untitled',
            description: comic.deck || 'No description available.',
            categories: ['Seeded'],
            rating: 0,
            image: comic.image?.original_url || '',
        }));

        // Insert data into the database
        await Comic.insertMany(comics);
        console.log('Database seeded successfully!');

        // Disconnect from MongoDB
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error.response?.data || error.message);
        mongoose.disconnect();
    }
}

// Run the seeding function
seedDatabase();

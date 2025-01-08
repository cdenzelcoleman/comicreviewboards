require("dotenv").config();
const mongoose = require('mongoose');
const axios = require('axios');
const Comic = require('../models/comic');

const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.COMIC_VINE_API_KEY;

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const API_URL = `${API_BASE_URL}/issues`;
        const response = await axios.get(API_URL, {
            params: {
                api_key: API_KEY,
                format: 'json',
            },
        });
        
        const comics = response.data.results.map(comic => ({
            title: comic.name || 'Untitled',
            description: comic.deck || 'No description available.',
            categories: ['Action'], 
            rating: 1, 
            format: 'Digital', 
            image: comic.image?.original_url || '',
            owner: 'camdcole@gmail.com', // Replace with a valid owner ID from your database
        }));

        await Comic.insertMany(comics);
        console.log('Database seeded successfully!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        mongoose.disconnect();
    }
}

seedDatabase();

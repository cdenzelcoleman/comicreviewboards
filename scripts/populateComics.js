const mongoose = require ('mongoose');
const axios = require('axios');
const Comic = require('../models/comic');
const API_BASE_URL = 'http://comicvine.gamespot.com/api';
const API_KEY = 'your_api_key';

async function seedDatabase() {
    try {
        mongoose.connect(process.env.MONGODB_URI);

        const response = await axios.get(`${API_BASE_URL}/issues`, {
            params: {
                api_key: API_KEY,
                format: 'json',
            },
        });
        const comics = response.data.results.map(comic => ({
            title: comic.name,
            description: comic.deck,
            categories: ['Seeded'],
            rating: 0,
            image: comic.image?.original_url || '',
        }));
        await Comic.insertMany(comic);
        console.log('Database seeded successfully!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        mongoose.disconnect();
    }
    
}
seedDatabase();
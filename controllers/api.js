const express = require('express');
const axios = require('axios');
const { format } = require('morgan');
const { param } = require('./comics');
const router = express.Router();
const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.COMIC_VINE_API_KEY || 'c69914b2348593fd0dfeeb4ef47532b1afef5587';

router.get('comics', async (req,res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(`$API_BASE_URL}/issues`, {
            params: {
                api_key: API_KEY,
                format: 'json',
                filter: query ? `name:${query}` : ','
            },
        });
        res.json({
            success: true,
            data: response.data.results,
        });
    } catch (error) {
        console.error('Error fetching comics from API:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comics. Please try again later',
        });
    }
});

route.get('/comics/:id', async(req, res) => {
    try{
        const comicId = req.params.id
;
const response = await axios.get(`$API_BASE_URL}/issues/${comicId}`, {
    param: {
        api_key: API_KEY,
        format: 'json',
    },
});
res.json({
    success: true,
    data: response.data.results,
});
} catch (error) {
    console.error('Error fetching comics from API:id', error.message);
    res.status(500).json({
        success: false,
        message: 'Failed to fetch comic details. Please try again later.',
    });
}
});
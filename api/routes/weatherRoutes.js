// client/api/routes/weatherRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint: /api/weather?city=Delhi
router.get('/', async (req, res) => {
  const city = req.query.city || 'Delhi';
  const apiKey = process.env.OPENWEATHER_API_KEY; // Add to your .env!
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const resp = await axios.get(url);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed", details: err.message });
  }
});

module.exports = router;

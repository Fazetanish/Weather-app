const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/weather', async (req, res) => {
  const city = (req.query.city || 'london').toLowerCase();

  const options = {
    method: 'GET',
    url: `https://open-weather13.p.rapidapi.com/city/${city}/EN`,
    headers: {
      'x-rapidapi-key': '3b4dcc3610msh4c2b6bd36f76e79p1d9580jsn39a0c6b8ec65', 
      'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Error fetching weather data');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
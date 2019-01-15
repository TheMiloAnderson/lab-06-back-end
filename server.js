'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.get('/location', (req, res) => {
  const locationData = searchToLatLong(req.query.data);
  res.send(locationData);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData, query);
  location.search_query = query;
  return location;
}

function Location(data, query) {
  for (let val in data.results) {
    if (data.results[val].address_components[0].long_name.toLowerCase() === query.toLowerCase()) {
      this.formatted_query = data.results[0].formatted_address;
      this.latitude = data.results[0].geometry.location.lat;
      this.longitude = data.results[0].geometry.location.lng;
    }
  }
}

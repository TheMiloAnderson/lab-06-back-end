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

app.get('/weather', (req, res) => {
  const weatherData = searchWeather(req.query.data);
  res.send(weatherData);
})

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
  if (!this.formatted_query) {
    this.status = 500;
    this.responseText = 'Sorry, something went wrong';
  }
}

function searchWeather() {
  let weather;
  const weatherData = require('./data/darksky.json');
  if (!weatherData.daily) {
    weather = {status: 500, responseText: 'Something went wrong'};
  } else {
    weather = new Weather(weatherData);
  }
  return weather;
}

function Weather(weatherData) {
  const output = [];
  for (let val in weatherData.daily.data) {
    const forecast = weatherData.daily.data[val].summary
    const time = weatherData.daily.data[val].time;
    const timeNew = new Date(time * 1000);
    const bestTime = timeNew.toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'});
    output.push({forecast: forecast, time: bestTime})
  }
  return output;
}

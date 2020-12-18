// Setup empty JS object to act as endpoint for all routes
const projectData = {}

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialise the main project folder.
app.use(express.static('dist'));


// Setup server
const port = 8000;
const server = app.listen(port, listening);
function listening() {
    console.log(`Running on localhost: ${port}`);
}


// POST route that adds incoming data to projectData
app.post('/place', postPlace);

function postPlace (req, res){
    let data = req.body;
    //console.log('data from server: ', data);
    projectData["latitude"] = data.latitude;
    projectData["longitude"] = data.longitude;
    projectData["country"] = data.country;
    res.send(projectData);
}


// POST route that adds incoming data to projectData
app.post('/weather', postWeather);

function postWeather (req, res){
    let data = req.body;
    // TODO: Add Weather and Temperature to projectData endpoint
    projectData["weather"] = data.weather;
    projectData["temperature"] = data.temperature;
    res.send(projectData);
}


// POST route that adds incoming data to projectData
app.post('/forecastWeather', postForecastWeather);

function postForecastWeather (req, res){
    let data = req.body;
    // TODO: Add Weather and Temperature to projectData endpoint
    projectData["forecastWeather"] = data.weather;
    projectData["forecastTemperature"] = data.temperature;
    res.send(projectData);
}


// GET route that returns the projectData object
app.get('/all', sendData);

function sendData (req, res) {
    console.log(projectData);
    res.send(projectData);
};
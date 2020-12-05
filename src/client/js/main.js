// Build dynamic URL query by joining variables
// q = Place Name
const baseURL = 'http://api.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   


// Weatherbit API call
const weatherbitBaseURL = 'http://api.weatherbit.io/v2.0';
let weatherbitLat = '51.51210888110816';
let weatherbitLon = '-0.12804098430341104';
const weatherbitApiKey = '8fcdb754804e4825afbd72eb47d12818';
let weatherbitGetRequest = `/current?lat=${weatherbitLat}&lon=${weatherbitLon}&key=${weatherbitApiKey}`;
// Example URL: https://api.weatherbit.io/v2.0/current?lat=51.51210888110816&lon=-0.12804098430341104&key=8fcdb754804e4825afbd72eb47d12818


//  Make a GET request on click
document.getElementById('search').addEventListener('click', performAction);


// GET Request
const getPlaceName = async(baseURL, placeName, apiKey) => {
    const res = await fetch(baseURL+placeName+apiKey)
    try {
      const data = await res.json();
      console.log(`Latitude: ${data.geonames[0].lat}`);
      console.log(`Longitude: ${data.geonames[0].lng}`);
      console.log(`Country Name: ${data.geonames[0].countryName}`);
      return data;
    } catch(error) {
      console.log("error", error);
    }
}


//Weatherbit GET Request
const getCurrentWeather = async(weatherbitBaseURL, weatherbitGetRequest) => {
    const res = await fetch(weatherbitBaseURL+weatherbitGetRequest)
    try {
      const data = await res.json();
      console.log(data);
      return data;
    } catch(error) {
      console.log("error", error);
    }
}


function performAction(e){
    // Retrieve the user inputted place name after the user clicks the search button
    let placeName = document.getElementById('place').value;

    
    // Calculate whether the trip is within a week
    // Date of user submission in milliseconds
    let d1 = Date.now();
    console.log(d1);

    // Date of departure in milliseconds
    let d = new Date(document.getElementById("departure-date").value);
    let d2 = Date.parse(d);
    console.log(d2);

    let difference = d2 - d1;
    console.log(difference);
    
    if (difference < 604800000) {
        console.log('Within a week. Provide current weather forecast');
    } else {
        console.log('More than 1 week. Proivide predicted weather forecast');
    }

    getPlaceName(baseURL, placeName, apiKey)
    .then(function(data){
        postData('/', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, country: data.geonames[0].countryName});
    })
    .then(getCurrentWeather(weatherbitBaseURL, weatherbitGetRequest))
    .then(function(data){
        updateUI;
    });
}


// Setup Async POST request
const postData = async (url = '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data), 
    });
    try {
        const newData = await response.json();
        return newData;
    }catch(error){
        console.log("error", error);
        // Appropriately handle the error
    }
};


// Update UI
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        document.getElementById('latitude').innerHTML = `The Latitude is: ${allData.latitude}`;
        document.getElementById('longitude').innerHTML = `The Longitude is: ${allData.longitude}`;
        document.getElementById('countryName').innerHTML = `Your Country Name is: ${allData.country}`;
    } catch(error){
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};


export {getPlaceName, getCurrentWeather, performAction};
// Build dynamic URL query by joining variables
// q = Place Name
const baseURL = 'http://api.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   


// Weatherbit API call
var myUrlWithParams = new URL ('http://api.weatherbit.io/v2.0/current');
//myUrlWithParams.searchParams.append("lat", "51.51210888110816");
//myUrlWithParams.searchParams.append("lon", "-0.12804098430341104");
//myUrlWithParams.searchParams.append("key", "8fcdb754804e4825afbd72eb47d12818");
//console.log(myUrlWithParams.href);


/*
let weatherbitBaseURL = `http://api.weatherbit.io/v2.0/current?`;
let query = `lat=${lat}&lon=${lon}&key=`;
let key = '8fcdb754804e4825afbd72eb47d12818';
// Example URL: https://api.weatherbit.io/v2.0/current?lat=51.51210888110816&lon=-0.12804098430341104&key=8fcdb754804e4825afbd72eb47d12818
*/


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

// Build Weatherbit API URL
const getLocation = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        //var location = {lat:allData.latitude, lon:allData.longitude};
        console.log(allData);
        myUrlWithParams.searchParams.append("lat", allData.latitude);
        myUrlWithParams.searchParams.append("lon", allData.longitude);
        //console.log(location);
        //return location;
        return myUrlWithParams;
    } catch(error){
        console.log("error", error);
    }
};


//Weatherbit GET Request
const getCurrentWeather = async(myUrlWithParams) => {
    myUrlWithParams.searchParams.append("key", "8fcdb754804e4825afbd72eb47d12818");
    myUrlWithParams.href;
    const res = await fetch(myUrlWithParams)
    try {
      const data = await res.json();
      console.log(data.data[0].weather.description);
      console.log(data.data[0].temp);
      return data;
    } catch(error) {
      console.log("error", error);
    }
}


async function performAction(e) {
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

    const data = await getPlaceName(baseURL, placeName, apiKey)
    await postData('/', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, country: data.geonames[0].countryName})
    await getLocation()
    await getCurrentWeather(myUrlWithParams)
    await updateUI();
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
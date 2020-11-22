// Build dynamic URL query by joining variables
// q = Place Name
const baseURL = 'http://api.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   

//  Make a GET request on click
document.getElementById('search').addEventListener('click', performAction);

function performAction(e){
    // Retrieve the user inputted place name after the user clicks the search button
    let placeName = document.getElementById('place').value;
    getPlaceName(baseURL, placeName, apiKey)
}

// GET Request
const getPlaceName = async(baseURL, placeName, apiKey) => {
    const res = await fetch(baseURL+placeName+apiKey)
    try {
      const data = await res.json();
      console.log(data.geonames[0]);
      console.log(`Latitude: ${data.geonames[0].lat}`);
      console.log(`Longitude: ${data.geonames[0].lng}`);
      console.log(`Country Name: ${data.geonames[0].countryName}`);
    } catch(error) {
      console.log("error", error);
    }
  }


/*
// Anticipate postcode as user response
const performAction = () => {
    // User response: Post Code in UK Format
    const placeName =  document.getElementById('placeName').value;    
    // User response: Feeling
    //const feeling = document.getElementById('feelings').value;

    // UK Date Format
    //let d = new Date();
    //let newDate = d.getDate() +'.'+ (d.getMonth()+1) +'.'+ d.getFullYear();     // getMonth() returns the month (0–11). Add 1 to adjust.

    getWeather(baseURL, placeName, apiKey)
    .then(function(data){
        console.log('data: ', data.geonames.lat, data.geonames.lng, data.geonames.countryName)
        postData('/', {latitude: data.geonames.lat, longitude: data.geonames.lng, country: data.geonames.countryName});
    })
    .then(function(data){
        updateUI;
    });
};


// Add event listener
document.getElementById('search').addEventListener('click', performAction);


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
        document.getElementById('longitude').innerHTML = `The Longitude is: ${allData.longitude} &#8451;`;
        document.getElementById('countryName').innerHTML = `Your Country Name is: ${allData.country}`;
    } catch(error){
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};

export {getPlaceName, performAction, postData, updateUI};

*/

export {getPlaceName, performAction};
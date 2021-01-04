# Travel App

## Introduction
In this project I built an asynchronous web app called Trip Planner. The user enters a place name such as a city, a departure date and a return date for their trip. With this information, three APIs will be called: Geonames, Weatherbit and Pixabay. Collectively, these will output the weather, current or forecasted, an image of the place name and the calculated duration of the trip.

A key part of this project was handling dates and so I created a date object to store the date components to avoid duplication and improve reusability. The output data gathered has also been stored in a single endpoint on the server.

## How to Run The Project
- In Development Mode - `npm run build-dev` 
- In Production Mode - `npm run build-prod`

## Additional Functionality
To extend my project, I decided to add the end date and display length of the trip.

## Technologies:
- HTML5
- CSS3
- JavaScript ES6
- Node
- Webpack

## Project Pre-requisites
- Setup Webpack
- Setup Node + Express with Project Dependencies
- Create a developer account to obtain API credentials to access Geonames, Weatherbit and Pixabay

## Project Features
- Express Server
- HTTP Requests and Routes
- Asynchronous JavaScript
- API Integration and Interdependencies
- Setting up Webpack
- Sass Styles
- Responsive Design
- Jest Implementation for Unit Testing

## Synopsis

Create a web interface that helps you find a local restaurant based on cuisine type and location using the Yelp API for local search.

You can add any specific features you think are useful, but it should
Allow searching by location
Allow selection type of food (e.g. Pizza, Italian, Tapas, etc.)
Allow sorting by rating or distance

API test console here: https://www.yelp.com/developers/api_console

## Directory Structure

├── _images
|   ├── png
|   └── svg
├── _scripts
|    └── resturant
|        └── resturant.js
├── _styles
|    └── resturant.css
|   
├── _templates
|    └── resturant
|        └── resturant_landing.html
├── _data
|    └── members.yml
├── app.js
├── main.js
├── webpack.config.js
├── package.json
├── bower.json
└── index.html


## Technology Stack

Used Angular framework for routing and data binding.
Jquery for DOM manipulations
Bundling and packaging using webpack
API - YELP for Data fetch.

## Installation

Download the source code and get to the root folder
1) Run bower Installation :  $ bower install
2) Run NPM Installation :  $ npm install
3) Run webpack-dev-server installation : npm install webpack-dev-server -g

you should have all the libs installed by now

3)start bundling the application :$ npm run bundle
4)Launch the application - real time refresh for CSS and HTML : $ sudo webpack-dev-server --hot --inline --open

5) Application should lauch at http://localhost:8080/.
6) Enjoy finding your resturant.

## Tests

TODO test cases are not yet written

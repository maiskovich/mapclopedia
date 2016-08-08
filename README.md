# Mapclopedia

Udacity Senior web developer 5st project

**Demo: https://mapencyclopedia.firebaseapp.com/#//**

Mapclopedia is a web app for exploring Wikipedia articles close to the user with features as:
* Offline-First
* Responsive Design
* ES6
* Interactive map
* local Forage
* HTML5 geolocation
* Wikipedia API

Its build with angularJS and based in the [Yeoman gulp-AngularJS generator](https://github.com/Swiip/generator-gulp-angular).

The app have two menus for visualizing Wikipedia articles that are close to the user, these data is obtained with the Wikipedia
API, using the 'geosearch' method. 
The app is first obtaining the user location with HTML5 geolocation API, sending it to the Wikipedia API, storing the results
with localForage, to be used offline, and then showing the articles order by distance(using a Javascript function to measure
distance between cordinates, obtained from StackOverfow). 

The first view is a list of articles showing them in a list, order by distance. The second view is a map, with the articles 
that are close to the user. In both menu the user can select which language to use, changing the language will delete the
actual data in localForage, and make new API calls, choosing the API URL based on the language(calling es.wikipedia for spanish
or calling en.wikipedia for english).

An approach of saving API calls was implemented in the way of getting the maximium number of articles per api call(500), and
only making a new api call when the available information is distant in more than 10 km to information stored(the informations
is stored in localForage using the coordinates as key of the data, then this key is used to measure the distance from the user
to the point where this information was obtained), this approach is implemented in `locationPlacesSearch.service.js`.



## Install

After cloning the repository you should run:

`npm install`

`bower install`


##### Being inside of the directory of the project you can run:


#### `serve`

For the development phase, use the command `gulp serve` to lunch server which supports live reload of your modifications.


#### `build`

For production, use the command `gulp` or `gulp build` to optimize the files for production, they will be saved optimized in the dist directory.
[More info](https://github.com/Swiip/generator-gulp-angular/blob/master/docs/user-guide.md#optimization-process)


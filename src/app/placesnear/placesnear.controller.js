//Distance function from stack overflow http://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}
// Converts numeric degrees to radians
function toRad(Value)
{
  return Value * Math.PI / 180;
}
export class PlacesnearController {
  constructor (serviceWorker,locationApi,placesApi,placesDatabase,$filter,$interval) {
    'ngInject';
    serviceWorker.register();
    this.locationApi=locationApi;
    this.placesApi=placesApi;
    this.placesDatabase=placesDatabase;
    this.$filter=$filter;
    let self=this;
    self.getPlaces();
    $interval(function(){ self.getPlaces() }, 10000);
    $interval(function(){ self.orderPlacesByDistance() }, 500);
    this.itemsPerPage=20;
    this.currentPage=1;
    this.oldNearestKey;
    this.nearestKey;
  }

  getPlaces(){
  let self=this;
  this.placesDatabase.getLocationsKeys().then((keys)=>{
    this.locationApi.getLocation().then((location)=>{
      this.location=location;
      let minimiumDistance=100;
      angular.forEach(keys, function(key) {
        let keySplit=key.split(" ");
        let keyLatitude=keySplit[0];
        let keyLongitude=keySplit[1];
        let distance=calcCrow(keyLatitude,keyLongitude,location.coords.latitude,location.coords.longitude);
        if(distance<minimiumDistance){
          self.nearestKey=key;
          minimiumDistance=distance;
        }
      });
      //If present data is more distant than 10km
      if(minimiumDistance>10){
      //get list of articles near the location
      self.placesApi.getPlaces(location).get().$promise.then((places)=> {
        //Store the list of articles
        self.placesDatabase.storePlaces(location,places.query.geosearch);
        self.nearestKey=location.coords.latitude+' '+location.coords.longitude;
        //Get details for the new places, if they dont exist
        self.placesDatabase.getArticlesKeys().then((articlesKeys)=>{
          angular.forEach(places.query.geosearch,function(place){
            if(articlesKeys.indexOf(place.pageid) == -1) {
              //get details for each article
              self.placesApi.getPlacesDetails(place).get().$promise.then((details)=> {
                self.placesDatabase.storeArticles(details.query.pages[Object.keys(details.query.pages)[0]]);
              });
            }
          });
        });
      });
      }
      //If the closest key is different to the last one we make a new search
      if(self.oldNearestKey!=self.nearestKey){
        self.placesDatabase.getPlacesByKey(self.nearestKey).then((places)=>{
          self.places=places;
          self.orderPlacesByDistance();
          //Limit the amount of places for paging to 100
          if(self.places.length>100){
            self.totalItems=100;
          }else{
            self.totalItems=self.places.length;
          }
        });
      }
      });
    //If we got places data we set the oldKey to be the same that the actual one to avoid new calls when data is the same
    if(this.places){
    self.oldNearestKey=self.nearestKey;
    }
    });


  }
  getPlaceDetails(place){
    console.log(place);
    if(!place.extract){
    this.placesDatabase.getArticlesByKey(place.pageid).then((details)=>{
      place.extract=details;
    });
    }else{
      place.extract=false;
    }
  }
  orderPlacesByDistance(){
    let self=this;
    //If we got places information
    if(self.places){
      angular.forEach(this.places,function(place){
        place.distance=calcCrow(place.lat,place.lon,self.location.coords.latitude,self.location.coords.longitude);
      });
      self.places=self.$filter('orderBy')(self.places, 'distance');
    }
  }
}

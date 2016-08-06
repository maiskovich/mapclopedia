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
export class LocationPlacesSearchService {
  constructor (placesApi,placesDatabase,$filter,$q) {
    'ngInject';
    this.placesApi=placesApi;
    this.placesDatabase=placesDatabase;
    this.$filter=$filter;
    let self=this;
    this.oldNearestKey='';
    this.nearestKey='';
    this.$q=$q;
  }

  getPlaces(location,language){
    let deferred = this.$q.defer();
    let promisesStoreArticles = [];
    let self=this;
    this.placesDatabase.getLocationsKeys().then((keys)=>{
        self.location=location;
        let minimiumDistance=100;
        angular.forEach(keys, function(key) {
          let keySplit=key.split("LAT");
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
          self.placesApi.getPlaces(location,language).get().$promise.then((places)=> {
            //Store the list of articles
            self.placesDatabase.storePlaces(location,places.query.geosearch).then(()=> {
                self.nearestKey=location.coords.latitude+'LAT'+location.coords.longitude;
                //Get details for the new places, if they dont exist
                self.placesDatabase.getArticlesKeys().then((articlesKeys)=>{
                  angular.forEach(places.query.geosearch,function(place){
                    let deferredStoreArticle = self.$q.defer();
                    promisesStoreArticles.push(deferredStoreArticle.promise);
                    if(articlesKeys.indexOf(place.pageid) == -1) {
                      //get details for each article
                      self.placesApi.getPlacesDetails(place,language).get().$promise.then((details)=> {
                        self.placesDatabase.storeArticles(details.query.pages[Object.keys(details.query.pages)[0]]).then(()=> {
                        deferredStoreArticle.resolve();
                        });
                      });
                    }else{
                      deferredStoreArticle.resolve();
                    }
                  });
                  self.$q.all(promisesStoreArticles).then(function () {
                    self.placesDatabase.getPlacesByKey(self.nearestKey).then((placesGet)=>{
                      self.places=placesGet;
                      self.orderPlacesByDistance();
                      self.oldNearestKey=self.nearestKey;
                      deferred.resolve(self.places);
                    });
                  });
                });

            });
          });
        }else{
        //If the closest key is different to the last one we make a new search
        if(self.oldNearestKey!=self.nearestKey || !self.places){
          self.placesDatabase.getPlacesByKey(self.nearestKey).then((places)=>{
            self.places=places;
            self.orderPlacesByDistance();
            self.oldNearestKey=self.nearestKey;
            deferred.resolve(self.places);
          });
        }else{
          self.orderPlacesByDistance();
          deferred.resolve(self.places);
        }
        }
    });

    return deferred.promise;
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

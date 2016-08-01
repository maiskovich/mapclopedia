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
  constructor (serviceWorker,locationApi,placesApi,placesDatabase) {
    'ngInject';
    serviceWorker.register();
    this.locationApi=locationApi;
    this.placesApi=placesApi;
    this.placesDatabase=placesDatabase;
    this.getPlaces();
  }

  getPlaces(){

  this.placesDatabase.getLocationsKeys().then((keys)=>{
    this.locationApi.getLocation().then((location)=>{
      let nearestKey;
      let minimiumDistance=100;
      angular.forEach(keys, function(key) {
        let keySplit=key.split(" ");
        let keyLatitude=keySplit[0];
        let keyLongitude=keySplit[1];
        let distance=calcCrow(keyLatitude,keyLongitude,location.coords.latitude,location.coords.longitude);
        if(distance<=10 && distance<minimiumDistance){
          nearestKey=key;
          minimiumDistance=distance;
        }
      });
      console.log(minimiumDistance);
      if(minimiumDistance>=20){
      this.placesApi.getPlaces(location).get().$promise.then((places)=> {
        this.placesDatabase.storePlaces(location,places.geonames);
        console.log(places);
        nearestKey=location.coords.latitude+' '+location.coords.longitude;
      });
      }
      this.placesDatabase.getPlacesByKey(nearestKey).then((places)=>{
        console.log(places);
      });
      });
    });
  }

}

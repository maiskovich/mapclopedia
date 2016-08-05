export class PlacesnearController {
  constructor (serviceWorker,locationPlacesSearch,placesDatabase) {
    'ngInject';
    serviceWorker.register();
    this.placesDatabase=placesDatabase;
    this.locationPlacesSearch=locationPlacesSearch;
    let self=this;
    //Set the id of the watch method to a variable to bind it to the navbar
    self.watchNear=navigator.geolocation.watchPosition(function(location){
      self.getPlacesList(location);
    }, this.errorReporting, {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000
    });
    this.itemsPerPage=20;
    this.currentPage=1;

  }
  getPlacesList(location){
    let self=this;
    self.locationPlacesSearch.getPlaces(location).then((places)=> {
      self.places = places;
      //Limit the amount of places for paging to 100
      if (self.places.length > 100) {
        self.totalItems = 100;
      } else {
        self.totalItems = self.places.length;
      }
    });
  }
  errorReporting(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
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

}

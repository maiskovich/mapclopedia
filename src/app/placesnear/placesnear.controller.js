export class PlacesnearController {
  constructor (serviceWorker,locationPlacesSearch,placesDatabase,$window) {
    'ngInject';
    serviceWorker.register();
    let self=this;
    self.placesDatabase=placesDatabase;
    self.locationPlacesSearch=locationPlacesSearch;
    self.$window=$window;
    //Use an object to get language correctly update from ng change in nav bar directive
    self.language={};
    self.language.val=self.$window.localStorage['language'] || 'en';
    self.locationOptions={
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000
    };
    //Set the id of the watch method to a variable to bind it to the navbar
    self.watchNear=navigator.geolocation.watchPosition(function(location){
      self.getPlacesList(location);
    }, function(err){self.errorReporting(err)}, self.locationOptions);
    self.itemsPerPage=20;
    self.currentPage=1;

  }
  getPlacesList(location){
    let self=this;
    self.lastLocation=location;
    self.locationPlacesSearch.getPlaces(location,self.language.val).then((places)=> {
      self.places = places;
      //Limit the amount of places for paging to 100
      if (self.places.length > 200) {
        self.totalItems = 200;
      } else {
        self.totalItems = self.places.length;
      }
    });
  }
  errorReporting(err) {
    this.locationeError='There was an error getting your location, the information we have is: '+err.message;
  }

  getPlaceDetails(place){
    if(!place.extract){
      this.placesDatabase.getArticlesByKey(place.pageid).then((details)=>{
        place.extract = details;
      });
    }else{
      place.extract=false;
    }
  }
  changeLanguage(){
    let self=this;
    self.$window.localStorage['language']=self.language.val;
    self.placesDatabase.deletePlaces().then(()=>{
      self.placesDatabase.deleteArticles().then(()=>{
        self.getPlacesList(self.lastLocation);
      });
    });
  }

}

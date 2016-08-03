export class PlacesnearController {
  constructor (serviceWorker,locationPlacesSearch,$interval,placesDatabase) {
    'ngInject';
    serviceWorker.register();
    let self=this;
    self.placesDatabase=placesDatabase;
    locationPlacesSearch.getPlaces().then((places)=>{
      self.places=places;
    });
    $interval(function(){ locationPlacesSearch.getPlaces().then((places)=>{
      self.places=places;
      //Limit the amount of places for paging to 100
      if(self.places.length>100){
        self.totalItems=100;
      }else{
        self.totalItems=self.places.length;
      }
    });}, 1000);
    this.itemsPerPage=20;
    this.currentPage=1;

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

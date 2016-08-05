export class PlacesmapController {
  constructor (serviceWorker,locationPlacesSearch,placesDatabase,leafletData,$scope,$filter) {
    'ngInject';
    serviceWorker.register();
    let self=this;
    self.leafletData=leafletData;
    self.placesDatabase=placesDatabase;
    self.locationPlacesSearch=locationPlacesSearch;
    self.$scope=$scope;
    self.$filter=$filter;
    //Set the id of the watch method to a variable to bind it to the navbar
    self.watchMap=navigator.geolocation.watchPosition(function(location){
      self.getPlacesMap(location);
    }, this.errorReporting, {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000
    });
  }
  getPlacesMap(location){
    let self=this;
    self.locationPlacesSearch.getPlaces(location).then((places)=>{
      if(!self.oldPlaces){
        self.oldPlaces=places;
      }
      places=self.$filter('limitTo')(places, 50, 0);

      if(places.toString() != self.oldPlaces.toString()){
        let myMarkers={};
        angular.forEach(places,function(place,key){
          self.getPlaceDetails(place.pageid).then((details)=>{
            myMarkers[place.pageid] =  {
              lat: place.lat,
              lng: place.lon,
              name: 'testname',
              message: '<div class="detailsMap">'+details+'</div>'

            };
          });
        });
        angular.extend(self.$scope, {
          markers: myMarkers
        });
        self.oldPlaces=places;
        self.leafletData.getMap().then((map)=>{
          map.fitBounds([[places[0].lat,places[0].lon],[places[places.length-1].lat,places[places.length-1].lon]]);
        });
      }
    });
  }
  errorReporting(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }
  getPlaceDetails(pageid){
    return this.placesDatabase.getArticlesByKey(pageid);
  }

}

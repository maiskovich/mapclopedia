export class PlacesmapController {
  constructor (serviceWorker,locationPlacesSearch,placesDatabase,leafletData,$scope,$filter,$window) {
    'ngInject';
    serviceWorker.register();
    let self=this;
    self.leafletData=leafletData;
    self.placesDatabase=placesDatabase;
    self.locationPlacesSearch=locationPlacesSearch;
    self.$window=$window;
    self.$scope=$scope;
    self.$filter=$filter;
    //Use an object to get language correctly update from ng change in nav bar directive
    self.language={};
    self.language.val=self.$window.localStorage['language'] || 'en';
    self.locationOptions={
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000
    };
    //Set the id of the watch method to a variable to bind it to the navbar
    self.watchMap=navigator.geolocation.watchPosition(function(location){
      self.getPlacesMap(location);
    }, function(err){self.errorReporting(err)}, self.locationOptions);
  }
  getPlacesMap(location){
    let self=this;
    self.lastLocation=location;
    self.locationPlacesSearch.getPlaces(location,self.language.val).then((places)=>{
      if(!self.oldPlaces){
        self.oldPlaces='';
      }
      places=self.$filter('limitTo')(places, 100, 0);
      //IF there are different places
      if(places.toString() != self.oldPlaces.toString()){
        let myMarkers={};
        angular.forEach(places,function(place,key){
          self.placesDatabase.getArticlesByKey(place.pageid).then((details)=>{
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
    this.locationeError='There was an error getting your location, the information we have is: '+err.message;
  }
  changeLanguage(){
    let self=this;
    self.$window.localStorage['language']=self.language.val;
    self.placesDatabase.deletePlaces().then(()=>{
      self.placesDatabase.deleteArticles().then(()=>{
        self.oldPlaces='';
        self.getPlacesMap(self.lastLocation);
      });
    });
  }

}

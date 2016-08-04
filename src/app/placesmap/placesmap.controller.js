export class PlacesmapController {
  constructor (serviceWorker,locationPlacesSearch,$interval,placesDatabase,leafletData,$scope,$filter) {
    'ngInject';
    serviceWorker.register();
    let self=this;
    self.leafletData=leafletData;
    self.placesDatabase=placesDatabase;
    this.markers = L.markerClusterGroup();
    locationPlacesSearch.getPlaces().then((places)=>{
      self.places=places;

    });
    $interval(function(){ locationPlacesSearch.getPlaces().then((places)=>{
      if(!self.oldPlaces){
        self.oldPlaces=places;
      }
      places=$filter('limitTo')(places, 50, 0);

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
        angular.extend($scope, {
          markers: myMarkers
        });
        self.oldPlaces=places;
        leafletData.getMap().then((map)=>{
          map.fitBounds([[places[0].lat,places[0].lon],[places[places.length-1].lat,places[places.length-1].lon]]);
        });
      }
    });}, 1000);

  }
  getPlaceDetails(pageid){
    return this.placesDatabase.getArticlesByKey(pageid);
  }

}

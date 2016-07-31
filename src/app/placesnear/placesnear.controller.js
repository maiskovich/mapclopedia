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
      console.log(keys);
    });

    this.locationApi.getLocation().then((location)=>{
      this.placesApi.getPlaces(location).get().$promise.then((places)=> {
        this.placesDatabase.storePlaces(location,places.geonames);
        console.log(places);
      });

    });
  }

}

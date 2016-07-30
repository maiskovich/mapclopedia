export class PlacesnearController {
  constructor (serviceWorker,locationApi,placesApi) {
    'ngInject';
    serviceWorker.register();
    this.locationApi=locationApi;
    this.placesApi=placesApi;
    this.getPlaces();
  }

  getPlaces(){
    this.locationApi.getLocation().then((location)=>{
      this.placesApi.getPlaces(location).then((places)=>{
        console.log(places);
      });

    });
  }

}

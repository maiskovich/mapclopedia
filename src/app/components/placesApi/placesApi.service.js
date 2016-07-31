export class PlacesApiService {
  constructor ($resource) {
    'ngInject';
    this.$resource=$resource;
  }

  getPlaces(location) {
    let requestUri = 'http://api.geonames.org/findNearbyWikipediaJSON';
    return this.$resource(requestUri,
      {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        username: 'mattais',
        lang:'es',
        radius:'20',
        maxRows:'500',
        callback: 'JSON_CALLBACK'
      },
      {
        get: {method: 'JSONP'}
      });
  }

}

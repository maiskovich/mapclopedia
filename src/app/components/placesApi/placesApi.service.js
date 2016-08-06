export class PlacesApiService {
  constructor ($resource) {
    'ngInject';
    this.$resource=$resource;
  }

  getPlaces(location,language) {
    let requestUri = 'https://'+language+'.wikipedia.org/w/api.php';
    return this.$resource(requestUri,
      {
        action:'query',
        list:'geosearch',
        gslimit:'500',
        gsradius:'10000',
        gscoord:location.coords.latitude+'|'+location.coords.longitude,
        format:'json',
        callback: 'JSON_CALLBACK'
      },
      {
        get: {method: 'JSONP'}
      });
  }
  getPlacesDetails(place,language) {
    let requestUri = 'https://'+language+'.wikipedia.org/w/api.php';
    return this.$resource(requestUri,
      {
        action:'query',
        prop:'extracts',
        exintro:'true',
        titles:place.title,
        format:'json',
        callback: 'JSON_CALLBACK'
      },
      {
        get: {method: 'JSONP'}
      });
  }

}

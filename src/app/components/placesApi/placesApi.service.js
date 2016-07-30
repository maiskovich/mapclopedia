var requestParms = {
  clientId: "IY5CSJJK20BYPPSSKHFEXE45D2HNG5GMHO3VGAOSPYB5MVKB",
  clientSecret: "Z2D4LBTLPZ5UR1ZDFGYCL1ALFJNP5QZ5Y33ERG0FLSDNM30M",
  version: "20131230"
}
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
        username: 'demo'
      },
      {
        get: {method: 'JSONP'}
      });
  }

}

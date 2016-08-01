export class PlacesDatabaseService {
  constructor ($localForage) {
    'ngInject';
    this.$localForage=$localForage;
  }
  //Store places, using as key the coordinates at the moment of saving the data
  storePlaces(location,places) {
    return this.$localForage.setItem(location.coords.latitude+' '+location.coords.longitude,places);
  }
  //Get all the keys, this keys are the coordinates of the moment that the data was saved
  getLocationsKeys() {
    return this.$localForage.keys();
  }
  //return the data related to the key(the coordinates)
  getPlacesByKey(key) {
    return this.$localForage.getItem(key);
  }


}

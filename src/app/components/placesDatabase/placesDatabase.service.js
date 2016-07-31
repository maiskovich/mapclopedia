export class PlacesDatabaseService {
  constructor ($localForage) {
    'ngInject';
    this.$localForage=$localForage;
  }

  storePlaces(location,places) {
    return this.$localForage.setItem(location.coords.latitude+' '+location.coords.longitude,places);
  }
  getLocationsKeys() {
    return this.$localForage.keys();
  }

}

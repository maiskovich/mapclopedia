export class LocationApiService {
  constructor ($q) {
    'ngInject';
    this.$q=$q;
  }

  getLocation() {
    var deferred = this.$q.defer();
    navigator.geolocation.getCurrentPosition((data) => {
      deferred.resolve(data);
    });
    return deferred.promise;
  }
}

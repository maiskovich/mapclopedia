export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
      activetab: '=',
      locationwatch: '=',
      languageoption: '=',
      languageChange: '&'
    },
    controller: NavbarController,
    controllerAs: 'navController'
  };
  return directive;
}

class NavbarController {
  constructor($scope,$window,$rootScope){
    'ngInject';
    this.$scope=$scope;
    let self=this;
    self.online=navigator.onLine;

    $window.addEventListener("online", function () {
      self.online = true;
      $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
      self.online = false;
      $rootScope.$digest();
    }, true);

  }
  cancelWatch() {
    navigator.geolocation.clearWatch(this.$scope.locationwatch);
  }

}

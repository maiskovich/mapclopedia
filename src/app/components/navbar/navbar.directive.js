export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
      activetab: '=',
      locationwatch: '='
    },
    controller: NavbarController,
    controllerAs: 'navController'
  };
  return directive;
}

class NavbarController {
  constructor($scope) {
    'ngInject';
    this.$scope=$scope;
  }
  cancelWatch() {
    navigator.geolocation.clearWatch(this.$scope.locationwatch);
  }

}

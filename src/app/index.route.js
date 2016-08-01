export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/placesnear/placesnear.html',
      controller: 'PlacesnearController',
      controllerAs: 'places'
    });

  $urlRouterProvider.otherwise('/');
}

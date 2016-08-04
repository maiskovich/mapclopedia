export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('placesnear', {
      url: '/',
      templateUrl: 'app/placesnear/placesnear.html',
      controller: 'PlacesnearController',
      controllerAs: 'places'
    })
    .state('placesmap', {
      url: '/placesmap',
      templateUrl: 'app/placesmap/placesmap.html',
      controller: 'PlacesmapController',
      controllerAs: 'map'
    });

  $urlRouterProvider.otherwise('/');
}

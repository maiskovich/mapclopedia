/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { PlacesnearController } from './placesnear/placesnear.controller';
import { PlacesmapController } from './placesmap/placesmap.controller';
import { ServiceWorkerService } from '../app/components/serviceWorker/serviceWorker.service';
import { PlacesApiService } from '../app/components/placesApi/placesApi.service';
import { LocationPlacesSearchService } from '../app/components/locationPlacesSearch/locationPlacesSearch.service';
import { PlacesDatabaseService } from '../app/components/placesDatabase/placesDatabase.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';

angular.module('5Mapclopedia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap','ngMaterial','LocalForageModule','leaflet-directive'])
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('serviceWorker', ServiceWorkerService)
  .service('placesApi', PlacesApiService)
  .service('locationPlacesSearch', LocationPlacesSearchService)
  .service('placesDatabase', PlacesDatabaseService)
  .controller('PlacesnearController', PlacesnearController)
  .controller('PlacesmapController', PlacesmapController)
  .directive('acmeNavbar', NavbarDirective);

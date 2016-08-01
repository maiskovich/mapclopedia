/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { PlacesnearController } from './placesnear/placesnear.controller';
import { ServiceWorkerService } from '../app/components/serviceWorker/serviceWorker.service';
import { PlacesApiService } from '../app/components/placesApi/placesApi.service';
import { LocationApiService } from '../app/components/locationApi/locationApi.service';
import { PlacesDatabaseService } from '../app/components/placesDatabase/placesDatabase.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';

angular.module('5Mapclopedia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap','ngMaterial','LocalForageModule'])
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('serviceWorker', ServiceWorkerService)
  .service('placesApi', PlacesApiService)
  .service('locationApi', LocationApiService)
  .service('placesDatabase', PlacesDatabaseService)
  .controller('PlacesnearController', PlacesnearController)
  .directive('acmeNavbar', NavbarDirective);

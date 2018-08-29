(function() {
  'use strict';

  angular.module('app')
    .factory('MeasurementService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('measurement/:service/:id', {}, {
          getAll:{
            isArray: true,
            method: 'GET'
          }
        });

      }
    ]);
})();
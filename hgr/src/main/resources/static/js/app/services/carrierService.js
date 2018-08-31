(function() {
  'use strict';

  angular.module('app')
    .factory('CarrierService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('carrier/:service/:id', {}, {
          saveCarrier: {
            method: 'POST'
          },
          getCarrierById:{
            method: 'GET'
          },
          updateCarrier:{
            method: 'PUT'
          },
          getCarrierByName: {
            method: 'GET',
            params: {
              service: 'name'
            }
          }
        });

      }
    ]);
})();
(function() {
  'use strict';

  angular.module('app')
    .factory('SalesService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('sales/:service/:id', {}, {
          save: {
            method: 'POST'
          },
          getSalesByCustomerDocument: {
            method: 'GET',
            params: {
              service: 'customerdocument'
            }
          }
        });

      }
    ]);
})();
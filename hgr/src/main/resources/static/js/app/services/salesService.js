(function() {
  'use strict';

  angular.module('app')
    .factory('SalesService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('sales/:service/:id', {}, {
          save: {
            method: 'POST'
          },
          update: {
            method: 'PUT'
          },
          getSalesByCustomerDocument: {
            method: 'GET',
            params: {
              service: 'customerdocument'
            }
          },
          getSalesByProviderDocument: {
            method: 'GET',
            params: {
              service: 'providerdocument'
            }
          },
          getSalesByFantasyNameCustomer: {
            method: 'GET',
            params: {
              service: 'customerfantasy'
            }
          },
          getSalesByFantasyNameProvider: {
            method: 'GET',
            params: {
              service: 'providerfantasy'
            }
          },
          getById: {
            method: 'GET'
          }
        });

      }
    ]);
})();
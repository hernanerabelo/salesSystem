(function() {
  'use strict';

  angular.module('app')
    .factory('CustomerService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('customer/:service/:id', {}, {
          saveCustomer: {
            method: 'POST'
          },
          getCustomerById:{
            method: 'GET'
          },
          updateCustomer:{
            method: 'PUT'
          }
        });

      }
    ]);
})();
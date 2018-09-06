(function() {
  'use strict';

  angular.module('app')
    .factory('ProductService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('product/:service/:id', {}, {
          save: {
            method: 'POST'
          },
          getById:{
            method: 'GET'
          },
          update:{
            method: 'PUT'
          },
          getByDescription: {
            method: 'GET',
            params: {
              service: 'description'
            }
          },
          getByCode: {
            method: 'GET',
            params: {
              service: 'code'
            }
          },
           getByProviderDocument: {
             method: 'GET',
             isArray: true,
             params: {
               service: 'providerDocument'
             }
           }
        });

      }
    ]);
})();
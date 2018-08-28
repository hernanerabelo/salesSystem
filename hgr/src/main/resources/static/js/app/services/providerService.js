(function() {
  'use strict';

  angular.module('app')
    .factory('ProviderService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {

        return $resource('provider/:service/:id', {}, {
          saveProvider: {
            method: 'POST'
          },
          getProviderById:{
            method: 'GET'
          },
          updateProvider:{
            method: 'PUT'
          },
          getProviderByDocumentNumber: {
            method: 'GET',
            params: {
              service: 'document'
            }
          },
          getProviderByFantasyName: {
            method: 'GET',
            params: {
              service: 'fantasyName'
            }
          },
          getProviderByLegalName: {
            method: 'GET',
            params: {
              service: 'legalName'
            }
          }
        });

      }
    ]);
})();
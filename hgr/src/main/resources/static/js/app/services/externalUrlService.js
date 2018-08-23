(function() {
  'use strict';

  angular.module('app')
    .factory('ExternalUrlService', ['$rootScope', '$location', '$http', '$resource',
      function($rootScope, $location, $http, $resource) {
      //http://api.postmon.com.br/v1/cep/*cep_a_consultar*
        return $resource("https://viacep.com.br/ws/:cep/json", {cep: '@cep'} , {
          getEnderecoByCEP: {
            method: 'GET'
          }
        });
      }
    ]);
})();
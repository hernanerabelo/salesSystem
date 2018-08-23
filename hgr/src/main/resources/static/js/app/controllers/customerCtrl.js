(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CustomerCtrl', ['$scope', '$rootScope', '$location', 'CustomerService', 'ButtonGeneratorService',
    'MessageGeneratorService',
    function($scope, $rootScope, $location, CustomerService, ButtonGeneratorService, MessageGeneratorService) {
      $scope.hasErrorInput = false;

      $scope.objectFind = {
        fantasyName: null,
        document: null
      };

      ButtonGeneratorService.putButtonsInSubMenu([{
          title: 'Novo Cliente',
          type: 'success',
          execute: function() {
            $location.url('/clientes/novo');
          }
        },
        {
          title: 'Buscar',
          id: 'enterKeyActive',
          type: 'primary',
          execute: function() {
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if (!!$scope.objectFind.fantasyName && !!$scope.objectFind.fantasyName.trim()) {
              $scope.customers = []; //CustomerService.getCustomerByFantasyName($scope.objectFind.fantasyName);
            } else if ($scope.objectFind.document && !!$scope.objectFind.document.trim()) {
              $scope.customers = []; //CustomerService.getCustomerByDocumentNumber($scope.objectFind.document);
            } else {
              $scope.hasErrorInput = true;
              MessageGeneratorService.createMessageWarning('Inserir nome ou número do documento para fazer a busca do cliente');
            }
          }
        }
      ]);
    }
  ]);
})();
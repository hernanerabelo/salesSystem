(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CustomerCtrl', ['$scope', '$rootScope', '$location', 'CustomerService', 'buttonGeneratorService',
    function($scope, $rootScope, $location, CustomerService, buttonGeneratorService) {
      $scope.hasErrorInput = false;

      $scope.objectFind = {
        fantasyName: null,
        document: null
      };

      buttonGeneratorService.putButtonsInSubMenu([{
          title: 'Novo Cliente',
          type: 'success',
          execute: function() {
            $location.url('/clientes/novo');
          }
        },
        {
          id: 'enterKeyActive',
          title: 'Buscar',
          type: 'primary',
          execute: function() {
            $rootScope.menuMessages = [];
            $scope.hasErrorInput = false;
            if (!!$scope.objectFind.fantasyName && !!$scope.objectFind.fantasyName.trim()) {
              $scope.customers = []; //CustomerService.getCustomerByFantasyName($scope.objectFind.fantasyName);
            } else if ($scope.objectFind.document && !!$scope.objectFind.document.trim()) {
              $scope.customers = []; //CustomerService.getCustomerByDocumentNumber($scope.objectFind.document);
            } else {
              $scope.hasErrorInput = true;
              $rootScope.menuMessages = [{
                title: 'Inserir nome ou número do documento para fazer a busca do cliente',
                type: 'warning'
              }];
            }
          }
        }
      ]);
    }
  ]);
})();
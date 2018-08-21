'use strict';

var app = angular.module('app');

app.controller('CustomerSaveCtrl', ['$scope', '$rootScope', '$location', 'customerService','buttonGeneratorService',
  function($scope, $rootScope, $location, customerService, buttonGeneratorService) {
    $scope.customer = {};

    buttonGeneratorService.putButtonsInSubMenu( [
        {
          title: 'Salvar',
          type: 'success',
          execute: function(){
            customerService.saveCustomer($scope.customer,
              {
                success: function(){
                  $location.url('/clientes');
                },
                error: function(){
                  $rootScope.menuMessages = [
                    {
                      title: 'Não foi possivel savar o usuário',
                      type: 'error'
                    }
                  ];
                }
              }
            );
          }
        }
      ]);

  }
]);

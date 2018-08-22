(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CustomerSaveCtrl', ['$scope', '$rootScope', '$location', 'CustomerService', 'buttonGeneratorService',
    function($scope, $rootScope, $location, CustomerService, buttonGeneratorService) {
      $scope.customer = {};

      buttonGeneratorService.putButtonsInSubMenu([{
        title: 'Salvar',
        type: 'success',
        execute: function() {
          this.isDisabled = true;
          CustomerService.saveCustomer($scope.customer,
            function() {
              buttonGeneratorService.enableButtons();
              $location.url('/clientes');
            },
            function(e) {
              buttonGeneratorService.enableButtons();
              $rootScope.menuMessages = [{
                title: 'Não foi possivel salvar o usuário - ' + e.data.message,
                type: 'danger'
              }];
            }
          );
        }
      }]);

    }
  ]);
})();
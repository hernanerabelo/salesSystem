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

      $scope.editCustomer = function(customer){
        if(customer.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/clientes/editar/' + customer.id);
        }else{
          MessageGeneratorService.createMessageWarning('Cliente sem ID');
        }
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
              CustomerService.getCustomerByDocumentNumber({ id: $scope.objectFind.document },
              function(response){
                $scope.customers = [response];
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o CPF/CNPJ informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar cliente');
                }
              });
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
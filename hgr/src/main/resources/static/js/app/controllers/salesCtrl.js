(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams',
    function( $scope, $rootScope, $location, SalesService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams ) {

      $scope.hasErrorInput = false;

      $scope.objectFind = {
        customerDocument: null
      };

      $scope.editSales = function(sales){
        if(sales.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/vendas/editar/' + sales.id);
        }else{
          MessageGeneratorService.createMessageWarning('Vendas sem ID');
        }
      };

      ButtonGeneratorService.putButtonsInSubMenu([{
          title: 'Nova Venda',
          type: 'success',
          icon: 'glyphicon glyphicon-user',
          execute: function() {
            $location.url('/vendas/criar');
          }
        },
        {
          title: 'Buscar',
          type: 'primary',
          icon: 'glyphicon glyphicon-search',
          execute: function() {
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if ( !!$scope.objectFind.customerDocument && !!$scope.objectFind.customerDocument.trim() ) {
              SalesService.getSalesByCustomerDocument( { id: $scope.objectFind.customerDocument },
              function(response){
                $scope.tableParams = new NgTableParams( {} , { dataset: response.content} );
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma venda para o documento do cliente informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar uma venda utilizando o documento do cliente');
                }
              });
            }else {
              $scope.hasErrorInput = true;
              MessageGeneratorService.createMessageWarning('Preencher um dos campos para realizar a busca');
            }
          }
        }
      ]);
    }
  ]);
})();
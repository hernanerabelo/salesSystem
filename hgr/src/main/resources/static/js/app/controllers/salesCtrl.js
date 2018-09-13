(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams', '$filter',
    function( $scope, $rootScope, $location, SalesService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams, $filter ) {

      $scope.hasErrorInput = false;

      $scope.objectFind = {
        customerDocument: null,
        fantasyNameCustomer: null,
        providerDocument: null,
        fantasyNameProvider: null
      };

      $scope.editSales = function(sales){
        if(sales.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/vendas/editar/' + sales.id);
        }else{
          MessageGeneratorService.createMessageWarning('Vendas sem ID');
        }
      };

      var populateTableUsingSales = function( salesList ){
        var tableResult = [];
        if( !!salesList ){
          for( var i = 0; i < salesList.length; i++ ){
            tableResult.push({
              provider: salesList[i].provider.fantasyName,
              customer: salesList[i].customer.fantasyName,
              createdAt: $filter('date')( salesList[i].createdAt, 'dd/MM/yyyy HH:mm:ss' ),
              createdBy: salesList[i].createdBy,
              priceTotal: salesList[i].totalPrice
            });
          }
        }
        $scope.tableParams = new NgTableParams( {} , { dataset: tableResult} );
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
            this.isDisabled = true;
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if ( !!$scope.objectFind.customerDocument && !!$scope.objectFind.customerDocument.trim() ) {
              var customerDocument = $scope.objectFind.customerDocument.trim().replace(/[^0-9]/g,'');
              SalesService.getSalesByCustomerDocument( { id: customerDocument },
                function(response){
                  ButtonGeneratorService.enableButtons();
                  populateTableUsingSales( response.content );
              }, function(error){
                ButtonGeneratorService.enableButtons();
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma venda para o documento do cliente informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar uma venda utilizando o documento do cliente');
                }
              });
            }else if ( !!$scope.objectFind.fantasyNameCustomer && !!$scope.objectFind.fantasyNameCustomer.trim() ) {
              SalesService.getSalesByFantasyNameCustomer( { id: $scope.objectFind.fantasyNameCustomer },
                function(response){
                  ButtonGeneratorService.enableButtons();
                  populateTableUsingSales( response.content );
              }, function(error){
                ButtonGeneratorService.enableButtons();
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma venda para o nome do cliente informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar uma venda utilizando o nome do cliente');
                }
              });
            }else if ( !!$scope.objectFind.providerDocument && !!$scope.objectFind.providerDocument.trim() ) {
              var providerDocument = $scope.objectFind.providerDocument.trim().replace(/[^0-9]/g,'');
              SalesService.getSalesByProviderDocument( { id: providerDocument },
                function(response){
                  ButtonGeneratorService.enableButtons();
                  populateTableUsingSales( response.content );
              }, function(error){
                ButtonGeneratorService.enableButtons();
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma venda para o documento do fornecedor informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar uma venda utilizando o documento do fornecedor');
                }
              });
            }else if ( !!$scope.objectFind.fantasyNameProvider && !!$scope.objectFind.fantasyNameProvider.trim() ) {
              SalesService.getSalesByFantasyNameProvider( { id: $scope.objectFind.fantasyNameProvider },
                function(response){
                  ButtonGeneratorService.enableButtons();
                  populateTableUsingSales( response.content );
              }, function(error){
                ButtonGeneratorService.enableButtons();
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma venda para o nome do fornecedor informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar uma venda utilizando o nome do fornecedor');
                }
              });
            }else {
              ButtonGeneratorService.enableButtons();
              $scope.hasErrorInput = true;
              $scope.tableParams = new NgTableParams( {} , { dataset: []} );
              MessageGeneratorService.createMessageWarning('Preencher um dos campos para realizar a busca');
            }
          }
        }
      ]);
    }
  ]);
})();
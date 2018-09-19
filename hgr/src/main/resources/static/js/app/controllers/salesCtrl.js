(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams', '$filter',
    function( $scope, $rootScope, $location, SalesService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams, $filter ) {

      $scope.hasErrorInput = false;

      $scope.parameterFilter = {
        start: null,
        finish: null,
        id: null
      };

      function changeFilter( value ){
        $scope.parameterFilter.id = value;
        $scope.parameterFilter.start = $scope.startDate? $scope.startDate.getTime() : null;
        $scope.parameterFilter.finish = $scope.finishDate? $scope.finishDate.getTime() : null;
      }

      $scope.objectFind = {
        customerDocument: null,
        fantasyNameCustomer: null,
        providerDocument: null,
        fantasyNameProvider: null
      };

      $scope.editSales = function(sales){
        ButtonGeneratorService.enableButtons();
        if(sales.id){
          $location.url('/vendas/editar/' + sales.id);
        }else{
          MessageGeneratorService.createMessageWarning('Venda sem ID');
        }
      };

      var populateTableUsingSales = function( salesList ){
        var tableResult = [];
        if( !!salesList ){
          for( var i = 0; i < salesList.length; i++ ){
            tableResult.push({
              id: salesList[i].id,
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
              changeFilter( customerDocument );
              SalesService.getSalesByCustomerDocument( $scope.parameterFilter ,
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
              changeFilter( "%" + $scope.objectFind.fantasyNameCustomer + "%" );
              SalesService.getSalesByFantasyNameCustomer( $scope.parameterFilter,
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
              changeFilter( providerDocument );
              SalesService.getSalesByProviderDocument( $scope.parameterFilter,
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
              changeFilter( "%" + $scope.objectFind.fantasyNameProvider + "%");
              SalesService.getSalesByFantasyNameProvider( $scope.parameterFilter,
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
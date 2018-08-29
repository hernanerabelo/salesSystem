(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CustomerCtrl', ['$scope', '$rootScope', '$location', 'CustomerService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, CustomerService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.hasErrorInput = false;

      $scope.objectFind = {
        fantasyName: null,
        legalName: null,
        document: null
      };

      $scope.editCustomer = function(customer){
        if(customer.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/cadastros/clientes/editar/' + customer.id);
        }else{
          MessageGeneratorService.createMessageWarning('Cliente sem ID');
        }
      };

      ButtonGeneratorService.putButtonsInSubMenu([{
          title: 'Novo Cliente',
          type: 'success',
          execute: function() {
            $location.url('/cadastros/clientes/novo');
          }
        },
        {
          title: 'Buscar',
          type: 'primary',
          execute: function() {
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if ( !!$scope.objectFind.fantasyName && !!$scope.objectFind.fantasyName.trim() ) {
              CustomerService.getCustomerByFantasyName( { id: $scope.objectFind.fantasyName },
              function(response){
                $scope.tableParams = new NgTableParams( {} , { dataset: response.content} );
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o NOME FANTASIA informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando Nome Fantasia');
                }
              });
            }else if( !!$scope.objectFind.legalName && !!$scope.objectFind.legalName.trim() ){
              CustomerService.getCustomerByLegalName( { id: $scope.objectFind.legalName },
              function(response){
              $scope.tableParams = new NgTableParams({}, { dataset: response.content});
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o NOME LEGAL informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando Nome Legal');
                }
              });
            } else if ($scope.objectFind.document && !!$scope.objectFind.document.trim()) {
              var document = $scope.objectFind.document.trim().replace(/[^0-9]/g,'');

              CustomerService.getCustomerByDocumentNumber({ id: document },
              function(response){
                $scope.tableParams = new NgTableParams({}, { dataset: response.content});
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o CPF/CNPJ informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando o CPF/CNPJ');
                }
              });
            } else {
              $scope.hasErrorInput = true;
              MessageGeneratorService.createMessageWarning('Preencher um dos campos para realizar a busca');
            }
          }
        }
      ]);
    }
  ]);
})();
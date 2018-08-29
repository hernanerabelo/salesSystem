(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProviderCtrl', ['$scope', '$rootScope', '$location', 'ProviderService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, ProviderService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.hasErrorInput = false;

      $scope.objectFind = {
        fantasyName: null,
        legalName: null,
        document: null
      };

      $scope.editProvider = function(provider){
        if(provider.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/cadastros/fornecedores/editar/' + provider.id);
        }else{
          MessageGeneratorService.createMessageWarning('Fornecedor sem ID');
        }
      };

      ButtonGeneratorService.putButtonsInSubMenu([{
          title: 'Novo Fornecedor',
          type: 'success',
          execute: function() {
            $location.url('/cadastros/fornecedores/novo');
          }
        },
        {
          title: 'Buscar',
          type: 'primary',
          execute: function() {
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if ( !!$scope.objectFind.fantasyName && !!$scope.objectFind.fantasyName.trim() ) {
              ProviderService.getProviderByFantasyName( { id: $scope.objectFind.fantasyName },
              function(response){
                $scope.tableParams = new NgTableParams( {} , { dataset: response.content} );
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum fornecedor para o NOME FANTASIA informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar fornecedor utilizando Nome Fantasia');
                }
              });
            }else if( !!$scope.objectFind.legalName && !!$scope.objectFind.legalName.trim() ){
              ProviderService.getProviderByLegalName( { id: $scope.objectFind.legalName },
              function(response){
              $scope.tableParams = new NgTableParams({}, { dataset: response.content});
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum fornecedor para o NOME LEGAL informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar fornecedor utilizando Nome Legal');
                }
              });
            } else if ($scope.objectFind.document && !!$scope.objectFind.document.trim()) {
              var document = $scope.objectFind.document.trim().replace(/[^0-9]/g,'');
              ProviderService.getProviderByDocumentNumber({ id: document },
              function(response){
                $scope.tableParams = new NgTableParams({}, { dataset: response.content});
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum fornecedor para o CPF/CNPJ informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar fornecedor utilizando o CPF/CNPJ');
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
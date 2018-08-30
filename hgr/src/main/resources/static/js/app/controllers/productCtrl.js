(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProductCtrl', ['$scope', '$rootScope', '$location', 'ProductService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, ProductService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.hasErrorInput = false;

      $scope.objectFind = {
        description: null,
        code: null
      };

      $scope.editProduct = function(product){
        if(product.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/cadastros/produtos/editar/' + product.id);
        }else{
          MessageGeneratorService.createMessageWarning('Produto sem ID');
        }
      };

      ButtonGeneratorService.putButtonsInSubMenu([{
          title: 'Novo Produto',
          type: 'success',
          icon: 'glyphicon glyphicon-user',
          execute: function() {
            $location.url('/cadastros/produtos/novo');
          }
        },
        {
          title: 'Buscar',
          type: 'primary',
          icon: 'glyphicon glyphicon-search',
          execute: function() {
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if ( !!$scope.objectFind.description && !!$scope.objectFind.description.trim() ) {
              ProductService.getByDescription( { id: $scope.objectFind.description },
              function(response){
                $scope.tableParams = new NgTableParams( {} , { dataset: response.content} );
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum produto para a Descrição informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar produto utilizando a DESCRIÇÃO');
                }
              });
            }else if( !!$scope.objectFind.code && !!$scope.objectFind.code.trim() ){
              ProductService.getByCode( { id: $scope.objectFind.code },
              function(response){
              $scope.tableParams = new NgTableParams({}, { dataset: response.content});
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum produto para o CODE informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar produto utilizando o CODE');
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
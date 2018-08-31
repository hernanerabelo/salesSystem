(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CarrierCtrl', ['$scope', '$rootScope', '$location', 'CarrierService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'NgTableParams', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, CarrierService, ButtonGeneratorService, MessageGeneratorService,
      NgTableParams, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.hasErrorInput = false;

      $scope.objectFind = {
        name: null
      };

      $scope.editCarrier = function(carrier){
        if(carrier.id){
          ButtonGeneratorService.enableButtons();
          $location.url('/cadastros/transportadoras/editar/' + carrier.id);
        }else{
          MessageGeneratorService.createMessageWarning('Transportadora sem ID');
        }
      };

      ButtonGeneratorService.putButtonsInSubMenu([{
          title: 'Nova Transportadora',
          type: 'success',
          icon: 'glyphicon glyphicon-user',
          execute: function() {
            $location.url('/cadastros/transportadoras/novo');
          }
        },
        {
          title: 'Buscar',
          type: 'primary',
          icon: 'glyphicon glyphicon-search',
          execute: function() {
            MessageGeneratorService.cleanAllMessages();
            $scope.hasErrorInput = false;
            if ( !!$scope.objectFind.name && !!$scope.objectFind.name.trim() ) {
              CarrierService.getCarrierByName( { id: $scope.objectFind.name },
              function(response){
                $scope.tableParams = new NgTableParams( {} , { dataset: response.content} );
              }, function(error){
                if( error.status == '404'){
                  MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma transportadora para o NOME FANTASIA informado');
                }else{
                  MessageGeneratorService.createMessageWarning('Erro ao buscar transportadora utilizando Nome');
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
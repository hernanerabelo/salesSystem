(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProductSaveCtrl', ['$scope', '$rootScope', '$location', 'ProductService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'BreadCrumbGeneratorService', 'MeasurementService', 'ProviderService',
    function($scope, $rootScope, $location, ProductService, ButtonGeneratorService,
      MessageGeneratorService, BreadCrumbGeneratorService, MeasurementService, ProviderService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.product = {
        measurement: {}
      };
      $scope.newMeasurement = {};

      $scope.getProviderUsingDocument = function(document){
        MessageGeneratorService.cleanAllMessages();
        if( !!document ){
          $scope.isDisabledSearchDocument = true;
          document = document.replace(/[^0-9]/g,'');
          ProviderService.getProviderByDocumentNumber({ id: document },
            function(response){
              if( response.content.length > 1 ){
                MessageGeneratorService.createMessageError('Foi encontrado mais de um fornecedor para o CPF/CNPJ informado');
              }else if( response.content.length == 0 ){
                MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum Fornecedor para o CPF/CNPJ informado');
              }else{
                $scope.product.provider = response.content[0];
              }
              $scope.isDisabledSearchDocument = false;
            }, function(error){
              if( error.status == '404'){
                MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum Fornecedor para o CPF/CNPJ informado');
              }else{
                MessageGeneratorService.createMessageWarning('Erro ao buscar Fornecedor utilizando o CPF/CNPJ');
              }
              $scope.isDisabledSearchDocument = false;
            });
        }else{
          MessageGeneratorService.createMessageWarning('Para localizar o fornecedor, insira o valor CPF/CNPJ');
        }
      };

      MeasurementService.getAll({},
        function(response){
          var lastOption = {
                                type: 'NOVA UNIDADE DE MEDIÇÃO'
                              };

          $scope.measurementOptions = response;
          $scope.measurementOptions.push( lastOption );
          $scope.product.measurement = $scope.measurementOptions[0];
        },
        function(){
          $scope.measurementOptions = [{
                                         type: 'NOVA UNIDADE DE MEDIÇÃO'
                                       }];
          $scope.product.measurement = $scope.measurementOptions[0];
        }
      );


      ButtonGeneratorService.putButtonsInSubMenu([{
        title: 'Salvar',
        icon: 'glyphicon glyphicon-ok',
        type: 'success',
        execute: function() {
          this.isDisabled = true;

          bootbox.confirm({
            size: "small",
            title: "<center><b>ATENÇÃO<b><center>",
            message: 'Deseja realmente <b>Salvar</b> o produto?',
            buttons: {
              confirm: {
                label: 'Sim',
                className: 'btn-success'
              },
              cancel: {
                label: 'Não',
                className: 'btn-danger'
              }
            },
            callback: function(result){
              MessageGeneratorService.cleanAllMessages();
              if( result ){
                if( !!$scope.product.measurement &&
                    !!$scope.product.measurement.type &&
                     $scope.product.measurement.type == 'NOVA UNIDADE DE MEDIÇÃO' ){
                  if( !!$scope.newMeasurement &&
                      !!$scope.newMeasurement.type &&
                      $scope.newMeasurement.type.trim() != '' ){

                    $scope.product.measurement = $scope.newMeasurement;
                  }else{
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Inserir um valor para unidade de medição');
                    $scope.$apply();
                    return;
                  }
                }
                if( !!$scope.product.value ){
                  $scope.product.value = $scope.product.value.replace( ',', '.' );
                }else{
                  ButtonGeneratorService.enableButtons();
                  MessageGeneratorService.createMessageError('Inserir um valor para o produto');
                  $scope.$apply();
                  return;
                }
                if( !$scope.product.provider ){
                  ButtonGeneratorService.enableButtons();
                  MessageGeneratorService.createMessageError('Inserir a empresa fornecedora do produto');
                  $scope.$apply();
                  return;
                }
                ProductService.save($scope.product,
                  function(response) {
                    ButtonGeneratorService.enableButtons();
                    $location.url('/cadastros/produtos/editar/' + response.id);
                  },
                  function(e) {
                    var message = '';
                    if( !!e.data && e.data.status == '400' && !!e.data.message ){
                      message = ' - ' + e.data.message;
                    }
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Não foi possivel salvar o produto ' + message);
                  }
                );
              }else{
                ButtonGeneratorService.enableButtons();
                MessageGeneratorService.createMessageInfo('Ação cancelada pelo usuário');
                $scope.$apply();
              }
            }
          });
        }
      }]);

    }
  ]);
})();
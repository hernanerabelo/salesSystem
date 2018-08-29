(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProductEditCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'ProductService', 'ButtonGeneratorService',
    'ProviderService', 'MessageGeneratorService', 'BreadCrumbGeneratorService', 'MeasurementService',
    function($scope, $rootScope, $location, $routeParams, ProductService, ButtonGeneratorService, ProviderService,
    MessageGeneratorService, BreadCrumbGeneratorService, MeasurementService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation(true, true);
      $scope.objectFind = { document : ''};
      $scope.edit = {
        isDisabledWaitingEdit: true
      };

      $scope.getProviderUsingDocument = function(document){
        $scope.isDisabledSearchCpf = true;
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
            $scope.isDisabledSearchCpf = false;
          }, function(error){
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum Fornecedor para o CPF/CNPJ informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar Fornecedor utilizando o CPF/CNPJ');
            }
            $scope.isDisabledSearchCpf = false;
          });
      };
      var buttonSave = {
        title: 'Salvar',
        type: 'success',
        execute: function() {
          this.isDisabled = true;

          bootbox.confirm({
            size: "small",
            title: "<center><b>ATENÇÃO<b><center>",
            message: 'Deseja realmente <b>Atualizar</b> o produto?',
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
                  $scope.product.value = ($scope.product.value + '').replace( ',', '.' );
                }else{
                  ButtonGeneratorService.enableButtons();
                  MessageGeneratorService.createMessageError('Inserir um valor para o produto');
                  $scope.$apply();
                  return;
                }

                ProductService.update($scope.product,
                  function(response) {
                    $scope.product = response;
                    $scope.measurementOptions = [ $scope.product.measurement ];
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.cleanAllMessages();
                    MessageGeneratorService.createMessageSuccess('Informações atualizadas com sucesso');
                    ButtonGeneratorService.cleanAllButtons();
                    ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
                    $scope.edit.isDisabledWaitingEdit = true;
                  },
                  function(e) {
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Não foi possivel atualizar informações do usuário - ' + e.data.message);
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
      };

      var buttonEdit = {
        title: 'Editar',
        type: 'primary',
        execute: function() {
          ButtonGeneratorService.cleanAllButtons();
          MessageGeneratorService.cleanAllMessages();
          ButtonGeneratorService.putButtonsInSubMenu([buttonSave, buttonCancel]);
          $scope.edit.isDisabledWaitingEdit = false;
          $scope.productTemp = angular.copy( $scope.product );

          $scope.newMeasurement = {};
          MeasurementService.getAll({},
            function(response){
              var lastOption = {
                                type: 'NOVA UNIDADE DE MEDIÇÃO'
                              };

              $scope.measurementOptions = response;
              $scope.measurementOptions.push( lastOption );
              for( var i = 0; i < $scope.measurementOptions.length; i++ ){
                if( $scope.measurementOptions[i].id == $scope.product.measurement.id ){
                  $scope.product.measurement = $scope.measurementOptions[i];
                  break;
                }
              }
            },
            function(){
              MessageGeneratorService.createMessageError('Não foi possivel buscar unidade de medição');
            }
          );

        }
      };

      var buttonCancel = {
        title: 'Cancelar',
        type: 'danger',
        execute: function() {
          this.isDisabled = true;
          bootbox.confirm({
            size: "small",
            title: "<center><b>ATENÇÃO<b><center>",
            message: '<b>Cancelar</b> as atualizações realizadas?',
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
              ButtonGeneratorService.enableButtons();
              if( result ){
                ButtonGeneratorService.cleanAllButtons();
                MessageGeneratorService.cleanAllMessages();
                ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
                $scope.edit.isDisabledWaitingEdit = true;
                $scope.product = $scope.productTemp;
                $scope.measurementOptions = [ $scope.product.measurement ];
              }else{
                ButtonGeneratorService.enableButtons();
                MessageGeneratorService.createMessageInfo('Atualização cancelada pelo usuário');
              }
              $scope.$apply();
            }
          });
        }
      };

      function getProductInfoInDataBase(){
        var productId = $routeParams.id;
        ProductService.getById({id : productId},
          function(response) {
            $scope.product = response;
            $scope.measurementOptions = [ $scope.product.measurement ];
            $scope.objectFind.document = $scope.product.provider.documentNumber;
          },
          function( error ) {
            if( !!error && error.status == '404' ){
              MessageGeneratorService.createMessageError('Não foi encontrado nenhum produto com id ' + productId);
            }else{
              MessageGeneratorService.createMessageError('Não foi possivel carregar informações do produto [' + productId + ']');
            }
            $scope.product = {};
            ButtonGeneratorService.cleanAllButtons();
          }
        );
      }
      getProductInfoInDataBase();
      ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
    }
  ]);
})();
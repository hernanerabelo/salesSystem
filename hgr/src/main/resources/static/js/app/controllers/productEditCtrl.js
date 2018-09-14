(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProductEditCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'ProductService', 'ButtonGeneratorService',
    'ProviderService', 'MessageGeneratorService', 'BreadCrumbGeneratorService', 'MeasurementService', '$window','NgTableParams',
    function($scope, $rootScope, $location, $routeParams, ProductService, ButtonGeneratorService, ProviderService,
    MessageGeneratorService, BreadCrumbGeneratorService, MeasurementService, $window, NgTableParams) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation(true, true);
      $scope.objectFind = {
        providerDocumentNumber : '',
        providerLegalName: '' };
      $scope.edit = {
        isDisabledWaitingEdit: true
      };

      $scope.selectProvider = function( providerTable ){
        $scope.product.provider = providerTable;
        $scope.objectFind.providerDocumentNumber = providerTable.documentNumber;
        $scope.objectFind.providerLegalName = providerTable.legalName;
      };

      $scope.getProviderUsingDocument = function(){
        $scope.isDisabledSearchProvider = true;
        $scope.provider = null;

        var document = $scope.objectFind.providerDocumentNumber;
        if( !!document && !!document.trim() ){
          MessageGeneratorService.cleanAllMessages();
          document = document.trim().replace(/[^0-9]/g,'');

          ProviderService.getProviderByDocumentNumber({ id: document },
          function(response){
            $scope.isDisabledSearchProvider = false;
            $scope.product.provider = response.content[0];
            $scope.objectFind.providerDocumentNumber = $scope.product.provider.documentNumber;
            $scope.objectFind.providerLegalName = $scope.product.provider.legalName;

          }, function(error){
            $scope.isDisabledSearchProvider = false;
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum fornecedor para o CPF/CNPJ informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar fornecedor utilizando o CPF/CNPJ');
            }
          });
        }else{
          $scope.isDisabledSearchProvider = false;
          MessageGeneratorService.createMessageWarning( 'Por favor insira o número do documento do fornecedor' );
        }
      };

      $scope.getProviderUsingLegalName = function(){
        $scope.isDisabledSearchProvider = true;
        $scope.provider = null;
        $scope.objectFind.providerDocumentNumber = null;
        var providerLegalName = $scope.objectFind.providerLegalName;
        if( !!providerLegalName && !!providerLegalName.trim() ){
          MessageGeneratorService.cleanAllMessages();

          ProviderService.getProviderByLegalName({ id: providerLegalName },
            function(response){
              $scope.isDisabledSearchProvider = false;
              if( response.content.length > 1 ){
                $scope.providerFindTable = new NgTableParams( {} , { dataset: response.content } );
                $("#findProviderModal").modal('show');
              }else{
                $scope.product.provider = response.content[0];

                $scope.objectFind.providerDocumentNumber = $scope.product.provider.documentNumber;
                $scope.objectFind.providerLegalName = $scope.product.provider.legalName;
              }
            }, function(error){
              $scope.isDisabledSearchProvider = false;
              if( error.status == '404'){
                MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum fornecedor para o nome informado');
              }else{
                MessageGeneratorService.createMessageWarning('Erro ao buscar fornecedor utilizando o nome');
              }
            });
        }else{
          $scope.isDisabledSearchProvider = false;
          MessageGeneratorService.createMessageWarning( 'Por favor insira o nome do fornecedor' );
        }
      };

      var buttonSave = {
        title: 'Salvar',
        icon: 'glyphicon glyphicon-ok',
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
                    $scope.newMeasurement = { type: ''};
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
        icon: 'glyphicon glyphicon-edit',
        execute: function() {
          ButtonGeneratorService.cleanAllButtons();
          MessageGeneratorService.cleanAllMessages();
          ButtonGeneratorService.putButtonsInSubMenu([buttonSave, buttonCancel]);
          $scope.edit.isDisabledWaitingEdit = false;

          $scope.newMeasurement = { type: ''};
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
              $scope.measurementOptions = [{
                                                       type: 'NOVA UNIDADE DE MEDIÇÃO'
                                           }];
              $scope.product.measurement = $scope.measurementOptions[0];
            }
          );

        }
      };

      var buttonCancel = {
        title: 'Cancelar',
        icon: 'glyphicon glyphicon-remove-sign',
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
               $window.location.reload();
              }else{
                ButtonGeneratorService.enableButtons();
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
            $scope.objectFind.providerDocumentNumber = $scope.product.provider.documentNumber;
            $scope.objectFind.providerLegalName = $scope.product.provider.legalName;
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
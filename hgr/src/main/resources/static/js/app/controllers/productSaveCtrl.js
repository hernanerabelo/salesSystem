(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProductSaveCtrl', ['$scope', '$rootScope', '$location', 'ProductService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'BreadCrumbGeneratorService', 'MeasurementService', 'ProviderService', 'NgTableParams',
    function($scope, $rootScope, $location, ProductService, ButtonGeneratorService,
      MessageGeneratorService, BreadCrumbGeneratorService, MeasurementService, ProviderService, NgTableParams) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

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

      $scope.product = {
        measurement: {}
      };
      $scope.newMeasurement = {};

      var populateMeasurementOptions = function(){
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
      };

      function cleanAllInput(){
        if( !!$scope.newMeasurement ){
          $scope.newMeasurement = {};
          populateMeasurementOptions();
        }
        $scope.product.code = '';
        $scope.product.description = '';
        $scope.product.value = '';
      }

      var validIfCreateOtherProdut = function(){
        bootbox.confirm({
          size: "small",
          title: "<center><b>ATENÇÃO<b><center>",
          message: 'Deseja <b>Cadastrar</b> outro produto?',
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
            if( result ){
              cleanAllInput();
              $scope.$apply();
              $scope.newMeasurement = { type: ''};
            }else{
              ButtonGeneratorService.enableButtons();
              $location.url('/cadastros/produtos');
              $scope.$apply();
            }
          }
        });
      };

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
                    MessageGeneratorService.createMessageError('Cadastrar um valor para unidade de medição');
                    $scope.$apply();
                    return;
                  }
                }
                if( !!$scope.product.value ){
                  $scope.product.value = $scope.product.value.replace( ',', '.' );
                }else{
                  ButtonGeneratorService.enableButtons();
                  MessageGeneratorService.createMessageError('Cadastrar um valor para o produto');
                  $scope.$apply();
                  return;
                }
                if( !$scope.product.provider ){
                  ButtonGeneratorService.enableButtons();
                  MessageGeneratorService.createMessageError('Cadastrar a empresa fornecedora do produto');
                  $scope.$apply();
                  return;
                }
                ProductService.save($scope.product,
                  function(response) {
                    MessageGeneratorService.createMessageSuccess( 'Produto ' + response.id + ' cadastrado com sucesso' );
                    ButtonGeneratorService.enableButtons();
                    validIfCreateOtherProdut();
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

      populateMeasurementOptions();
    }
  ]);
})();
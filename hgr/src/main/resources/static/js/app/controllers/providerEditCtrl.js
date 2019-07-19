(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProviderEditCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'ProviderService', 'ButtonGeneratorService',
    'ExternalUrlService', 'MessageGeneratorService', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, $routeParams, ProviderService, ButtonGeneratorService, ExternalUrlService,
    MessageGeneratorService, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation(true, true);

      $scope.edit = {
        isDisabledWaitingEdit: true
      };
      function populatAddressInfo(address){
        $scope.provider.address.street = address.logradouro;
        $scope.provider.address.neighborhood = address.bairro;
        $scope.provider.address.city = address.localidade;
        $scope.provider.address.state = address.uf;
        $scope.provider.address.number = null;
        $scope.provider.address.complement = null;
      }

      function getValue(value){
        if( !!value ){
          return value;
        }
        return '';
      }

      $scope.removeContactInProvider = function removeContactInProvider(index){
        bootbox.confirm({
          size: "small",
          title: "<center><b>ATENÇÃO<b><center>",
          message: '<b>Remover</b> o Contato ' + getValue( $scope.provider.contacts[index].name )+ '?',
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
              $scope.provider.contacts.splice(index, 1);
              $scope.$digest();
            }
          }
        });
      };

      function cleanInputAddress(){
        $scope.provider.address.street = '';
        $scope.provider.address.neighborhood = '';
        $scope.provider.address.city = '';
        $scope.provider.address.state = '';
      }

      $scope.createContactInProvider = function createContactInProvider(){
        if( !$scope.provider.contacts ){
          $scope.provider.contacts = [];
        }
        $scope.provider.contacts.push({});
      };

      $scope.populateAddressUsingCep = function populateAddressUsingCep(cep){
        cleanInputAddress();
        if( !!cep ){
          cep = cep.replace(/\D/g, '');
        }
        if ( !!cep ) {

          //Expressão regular para validar o CEP.
          var validacep = /^[0-9]{8}$/;

          //Valida o formato do CEP.
          if(validacep.test(cep)) {
            $scope.isDisabledSearchCep = true;
            ExternalUrlService.getEnderecoByCEP( {"cep" : cep},
              function(response) {
                $scope.isDisabledSearchCep = false;
                if( !( response.erro ) ){
                  MessageGeneratorService.cleanAllMessages();
                  populatAddressInfo(response);
                }else{
                  MessageGeneratorService.cleanAllMessages();
                  MessageGeneratorService.createMessageError('Não foi possivel buscar informação pelo CEP informado');
                }
              },
              function(e) {
                $scope.isDisabledSearchCep = false;
                console.log(e);
                MessageGeneratorService.cleanAllMessages();
                MessageGeneratorService.createMessageError('Não foi possivel buscar informação pelo CEP');
              });
          }else {
            MessageGeneratorService.cleanAllMessages();
            MessageGeneratorService.createMessageError('CEP informado está no formato invalido');
          }
        }else {
          MessageGeneratorService.cleanAllMessages();
          MessageGeneratorService.createMessageError('Campo referente ao CEP com valor inválidor');
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
            message: 'Deseja realmente <b>Atualizar</b> o fornecedor?',
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
                if( !!$scope.foundationDateFormated ){
                  $scope.provider.foundationDate = $scope.foundationDateFormated.getTime();
                }
                ProviderService.updateProvider($scope.provider,
                  function(response) {
                    $scope.provider = response;
                    if( !!$scope.provider.foundationDate ){
                      $scope.foundationDateFormated = new Date($scope.provider.foundationDate);
                    }
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
        icon: 'glyphicon glyphicon-edit',
        execute: function() {
          ButtonGeneratorService.cleanAllButtons();
          MessageGeneratorService.cleanAllMessages();
          ButtonGeneratorService.putButtonsInSubMenu([buttonSave, buttonCancel]);
          $scope.edit.isDisabledWaitingEdit = false;
          $scope.providerTemp = angular.copy( $scope.provider );
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
                ButtonGeneratorService.cleanAllButtons();
                MessageGeneratorService.cleanAllMessages();
                ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
                $scope.edit.isDisabledWaitingEdit = true;
                $scope.provider = $scope.providerTemp;
              }else{
                ButtonGeneratorService.enableButtons();
              }
              $scope.$apply();
            }
          });
        }
      };

      function getProviderInfoInDataBase(){
        var providerId = $routeParams.id;
        ProviderService.getProviderById({id : providerId},
          function(response) {
            $scope.provider = response;

            if( !!$scope.provider.foundationDate ){
              $scope.foundationDateFormated = new Date($scope.provider.foundationDate);
            }
          },
          function( error ) {
            if( !!error && error.status == '404' ){
              MessageGeneratorService.createMessageError('Não foi encontrado nenhum fornecedor com id ' + providerId);
            }else{
              MessageGeneratorService.createMessageError('Não foi possivel carregar informações do fornecedor [' + providerId + ']');
            }
            $scope.provider = {};
            ButtonGeneratorService.cleanAllButtons();
          }
        );
      }
      getProviderInfoInDataBase();
      ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
    }
  ]);
})();
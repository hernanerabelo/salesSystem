(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('ProviderSaveCtrl', ['$scope', '$rootScope', '$location', 'ProviderService', 'ButtonGeneratorService',
    'ExternalUrlService', 'MessageGeneratorService', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, ProviderService, ButtonGeneratorService, ExternalUrlService,
    MessageGeneratorService, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.provider = {
        address: {},
        contacts: []
      };

      function populatAddressInfo(address){
        $scope.provider.address.street = address.logradouro;
        $scope.provider.address.neighborhood = address.bairro;
        $scope.provider.address.city = address.localidade;
        $scope.provider.address.state = address.uf;
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
            $scope.isDisabledSearchCpf = true;
            ExternalUrlService.getEnderecoByCEP( {"cep" : cep},
              function(response) {
                $scope.isDisabledSearchCpf = false;
                if( !( response.erro ) ){
                  MessageGeneratorService.cleanAllMessages();
                  populatAddressInfo(response);
                }else{
                  MessageGeneratorService.cleanAllMessages();
                  MessageGeneratorService.createMessageError('Não foi possivel buscar informação pelo CEP informado');
                }
              },
              function() {
                $scope.isDisabledSearchCpf = false;
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

      ButtonGeneratorService.putButtonsInSubMenu([{
        title: 'Salvar',
        type: 'success',
        execute: function() {
          this.isDisabled = true;

          bootbox.confirm({
            size: "small",
            title: "<center><b>ATENÇÃO<b><center>",
            message: 'Deseja realmente <b>Salvar</b> o fornecedor?',
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
                ProviderService.saveProvider($scope.provider,
                  function(response) {
                    ButtonGeneratorService.enableButtons();
                    $location.url('/cadastros/fornecedores/editar/' + response.id);
                  },
                  function(e) {
                    var message = '';
                    if( !!e.data && e.data.status == '400' && !!e.data.message ){
                      message = ' - ' + e.data.message;
                    }
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Não foi possivel salvar o fornecedor ' + message);
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
(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CustomerSaveCtrl', ['$scope', '$rootScope', '$location', 'CustomerService', 'ButtonGeneratorService',
    'ExternalUrlService', 'MessageGeneratorService', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, CustomerService, ButtonGeneratorService, ExternalUrlService,
    MessageGeneratorService, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.customer = {
        address: {},
        contacts: []
      };

      function populatAddressInfo(address){
        $scope.customer.address.street = address.logradouro;
        $scope.customer.address.neighborhood = address.bairro;
        $scope.customer.address.city = address.localidade;
        $scope.customer.address.state = address.uf;
      }

      function getValue(value){
        if( !!value ){
          return value;
        }
        return '';
      }
      $scope.removeContactInCustomer = function removeContactInCustomer(index){
        bootbox.confirm({
          size: "small",
          title: "<center><b>ATENÇÃO<b><center>",
          message: '<b>Remover</b> o Contato ' + getValue( $scope.customer.contacts[index].name )+ '?',
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
              $scope.customer.contacts.splice(index, 1);
              $scope.$digest();
            }
          }
        });
      };

      function cleanInputAddress(){
        $scope.customer.address.street = '';
        $scope.customer.address.neighborhood = '';
        $scope.customer.address.city = '';
        $scope.customer.address.state = '';
      }

      $scope.createContactInCustomer = function createContactInCustomer(){
        if( !$scope.customer.contacts ){
          $scope.customer.contacts = [];
        }
        $scope.customer.contacts.push({});
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
        icon: 'glyphicon glyphicon-ok',
        type: 'success',
        execute: function() {
          this.isDisabled = true;

          bootbox.confirm({
            size: "small",
            title: "<center><b>ATENÇÃO<b><center>",
            message: 'Deseja realmente <b>Salvar</b> o cliente?',
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
                CustomerService.saveCustomer($scope.customer,
                  function(response) {
                    ButtonGeneratorService.enableButtons();
                    $location.url('/cadastros/clientes/editar/' + response.id);
                  },
                  function(e) {
                    var message = '';
                    if( !!e.data && e.data.status == '400' && !!e.data.message ){
                      message = ' - ' + e.data.message;
                    }
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Não foi possivel salvar o usuário ' + message);
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
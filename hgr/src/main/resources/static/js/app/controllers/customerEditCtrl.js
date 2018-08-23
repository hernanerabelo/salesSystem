(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CustomerEditCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'CustomerService', 'ButtonGeneratorService',
    'ExternalUrlService', 'MessageGeneratorService',
    function($scope, $rootScope, $location, $routeParams, CustomerService, ButtonGeneratorService, ExternalUrlService, MessageGeneratorService) {
      $scope.edit = {
        isDisabledWaitingEdit: true
      };

      function populatAddressInfo(address){
        $scope.customer.address.logradouro = address.logradouro;
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
        $scope.customer.address.logradouro = '';
        $scope.customer.address.neighborhood = '';
        $scope.customer.address.city = '';
        $scope.customer.address.state = '';
        $scope.customer.address.number = '';
        $scope.customer.address.complement = '';
      }

      $scope.createContactInCustomer = function createContactInCustomer(){
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
              function(e) {
                $scope.isDisabledSearchCpf = false;
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
                CustomerService.updateCustomer($scope.customer,
                  function(response) {
                    console.log(response);
                    $scope.customer = response;
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
          $scope.customerTemp = angular.copy( $scope.customer );
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
                $scope.customer = $scope.customerTemp;
              }
              $scope.$apply();
            }
          });
        }
      };

      function getCustomerInfoInDataBase(){
        var clientId = $routeParams.id;
        CustomerService.getCustomerById({id : clientId},
          function(response) {
            $scope.customer = response;

            if( !!$scope.customer.foundationDate ){
              $scope.foundationDateFormated = new Date($scope.customer.foundationDate);
            }
          },
          function() {
            MessageGeneratorService.createMessageError('Não foi encontrado nenhum cliente com id ' + clientId);
            $scope.customer = {};
            ButtonGeneratorService.cleanAllButtons();
          }
        );
      }
      getCustomerInfoInDataBase();
      ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
    }
  ]);
})();
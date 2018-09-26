(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CarrierSaveCtrl', ['$scope', '$rootScope', '$location', 'CarrierService', 'ButtonGeneratorService',
    'ExternalUrlService', 'MessageGeneratorService', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, CarrierService, ButtonGeneratorService, ExternalUrlService,
    MessageGeneratorService, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.carrier = {
        address: {},
        contacts: []
      };

      function populatAddressInfo(address){
        $scope.carrier.address.street = address.logradouro;
        $scope.carrier.address.neighborhood = address.bairro;
        $scope.carrier.address.city = address.localidade;
        $scope.carrier.address.state = address.uf;
        $scope.carrier.address.number = null;
        $scope.carrier.address.complement = null;
      }

      function getValue(value){
        if( !!value ){
          return value;
        }
        return '';
      }
      $scope.removeContactInCarrier = function removeContactInCarrier(index){
        bootbox.confirm({
          size: "small",
          title: "<center><b>ATENÇÃO<b><center>",
          message: '<b>Remover</b> o Contato ' + getValue( $scope.carrier.contacts[index].name )+ '?',
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
              $scope.carrier.contacts.splice(index, 1);
              $scope.$digest();
            }
          }
        });
      };

      function cleanInputAddress(){
        $scope.carrier.address.street = '';
        $scope.carrier.address.neighborhood = '';
        $scope.carrier.address.city = '';
        $scope.carrier.address.state = '';
      }

      $scope.createContactInCarrier = function createContactInCarrier(){
        if( !$scope.carrier.contacts ){
          $scope.carrier.contacts = [];
        }
        $scope.carrier.contacts.push({});
      };

      $scope.populateAddressUsingCep = function populateAddressUsingCep(){
        var cep = $scope.carrier.address.cep;
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
              function() {
                $scope.isDisabledSearchCep = false;
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
            message: 'Deseja realmente <b>Salvar</b> a transportadora?',
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
                CarrierService.saveCarrier($scope.carrier,
                  function(response) {
                    ButtonGeneratorService.enableButtons();
                    $location.url('/cadastros/transportadoras/editar/' + response.id);
                  },
                  function(e) {
                    var message = '';
                    if( !!e.data && e.data.status == '400' && !!e.data.message ){
                      message = ' - ' + e.data.message;
                    }
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Não foi possivel salvar a transportadora ' + message);
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
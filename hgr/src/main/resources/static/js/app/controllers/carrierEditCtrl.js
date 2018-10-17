(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('CarrierEditCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'CarrierService', 'ButtonGeneratorService',
    'ExternalUrlService', 'MessageGeneratorService', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, $routeParams, CarrierService, ButtonGeneratorService, ExternalUrlService,
    MessageGeneratorService, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation(true, true);

      $scope.edit = {
        isDisabledWaitingEdit: true
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
            message: 'Deseja realmente <b>Atualizar</b> a transportadora?',
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
                CarrierService.updateCarrier($scope.carrier,
                  function(response) {
                    $scope.carrier = response;
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.cleanAllMessages();
                    MessageGeneratorService.createMessageSuccess('Informações atualizadas com sucesso');
                    ButtonGeneratorService.cleanAllButtons();
                    ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
                    $scope.edit.isDisabledWaitingEdit = true;
                  },
                  function(e) {
                    ButtonGeneratorService.enableButtons();
                    MessageGeneratorService.createMessageError('Não foi possivel atualizar informações da transportadora - ' + e.data.message);
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
          $scope.carrierTemp = angular.copy( $scope.carrier );
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
                $scope.carrier = $scope.carrierTemp;
              }else{
                ButtonGeneratorService.enableButtons();
              }
              $scope.$apply();
            }
          });
        }
      };

      function getCarrierInfoInDataBase(){
        var carrierId = $routeParams.id;
        CarrierService.getCarrierById({id : carrierId},
          function(response) {
            $scope.carrier = response;
          },
          function( error ) {
            if( !!error && error.status == '404' ){
              MessageGeneratorService.createMessageError('Não foi encontrado nenhuma transportadora com id ' + carrierId);
            }else{
              MessageGeneratorService.createMessageError('Não foi possivel carregar informações da transportadora [' + carrierId + ']');
            }
            $scope.carrier = {};
            ButtonGeneratorService.cleanAllButtons();
          }
        );
      }
      ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);

      $scope.start = function(){
        getCarrierInfoInDataBase();
      };
    }
  ]);
})();
(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesEditCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'BreadCrumbGeneratorService', 'CustomerService', 'ExternalUrlService', 'ProductService',
    'ProviderService', 'NgTableParams', 'CarrierService', '$routeParams', '$window',
    function($scope, $rootScope, $location, SalesService, ButtonGeneratorService,
    MessageGeneratorService, BreadCrumbGeneratorService, CustomerService, ExternalUrlService, ProductService,
    ProviderService, NgTableParams, CarrierService, $routeParams, $window) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation(true,true);
      $scope.edit = {
        isDisabledWaitingEdit: true
      };

      function populateInputs(){
        $scope.customer = $scope.sales.customer;
        $scope.address = $scope.sales.address;
        $scope.contact = $scope.sales.contacts[0];
        $scope.carrier = $scope.sales.carrier;
        $scope.provider = $scope.sales.provider;

        for( var i = 0; i < $scope.sales.productSales.length; i++ ){
          $scope.selectProduct( $scope.sales.productSales[i].product );
          $scope.productSelected.count = $scope.sales.productSales[i].count;
          $scope.productSelected.discount = $scope.sales.productSales[i].discount;
          $scope.addProductToSales( $scope.productSelected );
        }

        $scope.objectFind = {
          customerDocumentNumber: $scope.customer.documentNumber,
          customerLegalNamer: $scope.customer.legalName,
          providerLegalName: $scope.provider.legalName,
          providerDocumentNumber: $scope.provider.documentNumber,
          carrierType: $scope.sales.type,
          carrierName: $scope.carrier? $scope.carrier.name : '',
        };

        $scope.getProductsUsingDocumentOfProvider( $scope.provider.documentNumber );
      }

      function initializeSalesValues() {
        var salesId = $routeParams.id;
        SalesService.getById({id : salesId},
          function(response) {
            $scope.sales = response;

            populateInputs();
          },
          function( error ) {
            if( !!error && error.status == '404' ){
              MessageGeneratorService.createMessageError('Não foi encontrado nenhuma venda com id ' + salesId);
            }else{
              MessageGeneratorService.createMessageError('Não foi possivel carregar informações da venda para o id [' + salesId + ']');
            }
            $scope.sales = {
              customer:null,
              contacts: null,
              address: null,
              type:'',
              carrier: null
            };
            ButtonGeneratorService.cleanAllButtons();
          }
        );
      }

      $scope.removeProduct = function (index){
        bootbox.confirm({
          size: "small",
          title: "<center><b>ATENÇÃO<b><center>",
          message: '<b>Remover</b> o produto da lista?',
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
              $scope.selectedProductsToPutInTable.splice(index, 1);
              $scope.selectedProductsTable = new NgTableParams( {} , { dataset: $scope.selectedProductsToPutInTable } );
              $scope.$digest();
            }
          }
        });
      };

      $scope.providerProducts = [];

      $scope.getCarrierByName = function(){
        $scope.isDisabledSearchCarrier = true;
        if( !!$scope.objectFind.carrierName && !!$scope.objectFind.carrierName.trim() ){
          CarrierService.getCarrierByName({ id : $scope.objectFind.carrierName.trim() },
            function(response){
              $scope.isDisabledSearchCarrier = false;
              if( response.content.length > 1 ){
                $scope.carrierFindTable = new NgTableParams( {} , { dataset: response.content } );
                $("#findCarrierModal").modal('show');
              }else{
                $scope.carrier = response.content[0];
                $scope.objectFind.carrierName = $scope.carrier.name;
              }
            },
            function(error){
              $scope.isDisabledSearchCarrier = false;
              if( error.status == '404'){
                MessageGeneratorService.createMessageWarning('Não foi encontrado nenhuma transportadora para o nome informado');
              }else{
                MessageGeneratorService.createMessageWarning('Erro ao buscar a transportadora utilizando o nome');
              }
            }
          );
        }else{
          MessageGeneratorService.createMessageWarning("Não foi informado nome da transportadora.");
        }
      };

      $scope.getCustomerUsingLegalName = function(){
        $scope.isDisabledSearchCustomer = true;
        $scope.customer = null;
        $scope.address = null;
        $scope.contact = null;
        $scope.carrier = null;
        $scope.objectFind.customerDocumentNumber = null;
        var customerLegalNamer = $scope.objectFind.customerLegalNamer;
        if( !!customerLegalNamer && !!customerLegalNamer.trim() ){
          MessageGeneratorService.cleanAllMessages();

          CustomerService.getCustomerByLegalName({ id: customerLegalNamer },
          function(response){
            $scope.isDisabledSearchCustomer = false;
            if( response.content.length > 1 ){
              $scope.customerFindTable = new NgTableParams( {} , { dataset: response.content } );
              $("#findCustomerModal").modal('show');
            }else{
              $scope.customer = response.content[0];
              $scope.address = angular.copy($scope.customer.address);
              $scope.address.id = null;
              if( !!$scope.customer.contacts && $scope.customer.contacts.length > 0 ){
                $scope.contact = angular.copy( $scope.customer.contacts[0] );
                $scope.contact.id = null;
              }else{
                $scope.contact = {};
              }

              $scope.objectFind = {
                carrierType:'CIF'
              };

              $scope.objectFind.customerDocumentNumber = $scope.customer.documentNumber;
              $scope.objectFind.customerLegalNamer = $scope.customer.legalName;
            }
          }, function(error){
            $scope.isDisabledSearchCustomer = false;
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o nome informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando o nome');
            }
          });
        }else{
          $scope.isDisabledSearchCustomer = false;
          MessageGeneratorService.createMessageWarning( 'Por favor insira o nome do cliente' );
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
              $scope.selectedProductsToPutInTable = [];
              $scope.selectedProductsTable = new NgTableParams( {} , { dataset: $scope.selectedProductsToPutInTable } );
              if( response.content.length > 1 ){
                $scope.providerFindTable = new NgTableParams( {} , { dataset: response.content } );
                $("#findProviderModal").modal('show');
              }else{
                $scope.provider = response.content[0];

                $scope.objectFind.providerDocumentNumber = $scope.provider.documentNumber;
                $scope.objectFind.providerLegalName = $scope.provider.legalName;
                $scope.getProductsUsingDocumentOfProvider( $scope.provider.documentNumber );
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

      $scope.selectCustomer = function( customerTable ){
        $scope.customer = customerTable;
        $scope.address = angular.copy($scope.customer.address);
        $scope.address.id = null;
        if( !!$scope.customer.contacts && $scope.customer.contacts.length > 0 ){
          $scope.contact = angular.copy( $scope.customer.contacts[0] );
          $scope.contact.id = null;
        }else{
          $scope.contact = {};
        }

        $scope.objectFind.carrierType = 'CIF';

        $scope.objectFind.customerDocumentNumber = customerTable.documentNumber;
        $scope.objectFind.customerLegalNamer = customerTable.legalName;
      };

      $scope.selectProvider = function( providerTable ){
        $scope.provider = providerTable;
        $scope.objectFind.providerDocumentNumber = providerTable.documentNumber;
        $scope.objectFind.providerLegalName = providerTable.legalName;
        $scope.getProductsUsingDocumentOfProvider( $scope.provider.documentNumber );
      };

      $scope.selectCarrier = function( carrierTable ){
        $scope.carrier = carrierTable;
        $scope.objectFind.carrierName = carrierTable.name;
      };

      $scope.isSelected = function( product ){
        if( !!$scope.selectedProductsToPutInTable ){
          for( var i = 0; i < $scope.selectedProductsToPutInTable.length; i++ ){
            if( product.id == $scope.selectedProductsToPutInTable[i].productId ){
              return true;
            }
          }
        }
        return false;
      };

      $scope.getCustomerUsingDocument = function(){
        $scope.isDisabledSearchCustomer = true;
        $scope.customer = null;
        $scope.address = null;
        $scope.contact = null;
        $scope.carrier = null;
        $scope.objectFind.customerLegalNamer = null;
        var document = $scope.objectFind.customerDocumentNumber;
        if( !!document && !!document.trim() ){
          MessageGeneratorService.cleanAllMessages();
          document = document.trim().replace(/[^0-9]/g,'');

          CustomerService.getCustomerByDocumentNumber({ id: document },
          function(response){
            $scope.isDisabledSearchCustomer = false;
            $scope.customer = response.content[0];
            $scope.address = angular.copy($scope.customer.address);
            $scope.address.id = null;
            if( !!$scope.customer.contacts && $scope.customer.contacts.length > 0 ){
              $scope.contact = angular.copy( $scope.customer.contacts[0] );
              $scope.contact.id = null;
            }else{
              $scope.contact = {};
            }

            $scope.objectFind.carrierType = 'CIF';

            $scope.objectFind.customerDocumentNumber = $scope.customer.documentNumber;
            $scope.objectFind.customerLegalNamer = $scope.customer.legalName;
          }, function(error){
            $scope.isDisabledSearchCustomer = false;
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o CPF/CNPJ informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando o CPF/CNPJ');
            }
          });
        }else{
          $scope.isDisabledSearchCustomer = false;
          MessageGeneratorService.createMessageWarning( 'Por favor insira o número do documento do cliente' );
        }
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
            $scope.selectedProductsToPutInTable = [];
            $scope.selectedProductsTable = new NgTableParams( {} , { dataset: $scope.selectedProductsToPutInTable } );
            $scope.provider = response.content[0];
            $scope.objectFind.providerDocumentNumber = $scope.provider.documentNumber;
            $scope.objectFind.providerLegalName = $scope.provider.legalName;
            $scope.getProductsUsingDocumentOfProvider( $scope.provider.documentNumber );

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

      function populatAddressInfo(address){
        $scope.address.street = address.logradouro;
        $scope.address.neighborhood = address.bairro;
        $scope.address.city = address.localidade;
        $scope.address.state = address.uf;
        $scope.address.number = null;
        $scope.address.complement = null;
      }

      function cleanInputAddress(){
        $scope.address.street = '';
        $scope.address.neighborhood = '';
        $scope.address.city = '';
        $scope.address.state = '';
      }

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

      $scope.startModalNewProdut = function(){
        MessageGeneratorService.cleanAllMessages();
      };

      $scope.getProductsUsingDocumentOfProvider = function( documentNumber ){
        documentNumber = documentNumber.trim().replace(/[^0-9]/g,'');
        ProductService.getByProviderDocument( { id: documentNumber },
          function(response){
            $scope.providerProductsTable = new NgTableParams( {} , { dataset: response } );

          }, function(error){
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum produto para o fornecedor informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar produto utilizando o forecedor');
            }
          });
      };
      $scope.selectedProductsToPutInTable = [];
      $scope.selectedProductsTable = new NgTableParams( {} , { dataset: $scope.selectedProductsToPutInTable } );

      $scope.selectProduct = function( product ){
        $scope.productSelected = {
          productId: product.id,
          code: product.code,
          description: product.description,
          value: product.value,
          measurement: product.measurement.type,
          discount: 0.00,
          count: '',
          total: ''
        };
      };


      $scope.addProductToSales = function( product ){
        if( !!product ){
          var hideNewProductModal = function(){
            $("#newProductModal").modal('hide');
          };
          for( var i = 0; i < $scope.selectedProductsToPutInTable.length; i++ ){
            if( $scope.selectedProductsToPutInTable[i].productId == product.productId ){
              MessageGeneratorService.createBootBoxAlert('ATENÇÃO',
              'Produto ' + product.description + ' já foi selecionando anteriormente', '','','', hideNewProductModal);

              return;
            }
          }

          if( !!product.count ){
            product.total = ( ( product.value * product.count ) - product.discount).toFixed(2);
            $scope.selectedProductsToPutInTable.push( product );
            $scope.selectedProductsTable = new NgTableParams( {} , { dataset: $scope.selectedProductsToPutInTable } );

            $scope.productSelected = null;
          }else{
            MessageGeneratorService.createBootBoxAlert('ATENÇÃO',
              'Não foi inserido a quantidade do produto', '','','', function(){
                $("#newProductModal").modal('hide');
              });
          }
        }else{
          MessageGeneratorService.createBootBoxAlert( 'ATENÇÃO',
              'Não foi selecionando nenhum produto para adicionar', '','','', function(){
                $("#newProductModal").modal('hide');
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
            message: 'Deseja realmente <b>Atualizar</b> a venda?',
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

                $scope.sales.type = $scope.objectFind.carrierType;
                $scope.sales.customer = $scope.customer;
                $scope.sales.address = $scope.address;
                $scope.sales.contacts = [ $scope.contact ];
                $scope.sales.carrier = $scope.carrier;
                $scope.sales.provider = $scope.provider;
                $scope.sales.productSales = $scope.selectedProductsToPutInTable;

                SalesService.update( $scope.sales, function(response){
                  $window.location.reload();
                }, function(e){
                  var message = '';
                  if( !!e.data && e.data.status == '400' && !!e.data.message ){
                    message = e.data.message;
                  }
                  ButtonGeneratorService.enableButtons();
                  MessageGeneratorService.createMessageError('Não foi possivel atualizar a venda. ' + message);
                });
              }else{
                ButtonGeneratorService.enableButtons();
                MessageGeneratorService.createMessageInfo('Ação cancelada pelo usuário');
                $scope.$apply();
              }
            }
          });
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
      ButtonGeneratorService.putButtonsInSubMenu([buttonEdit]);
      initializeSalesValues();
    }//fim main function
  ]);
})();
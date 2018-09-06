(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesSaveCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'BreadCrumbGeneratorService', 'CustomerService', 'ExternalUrlService', 'ProductService',
    'ProviderService', 'NgTableParams',
    function($scope, $rootScope, $location, SalesService, ButtonGeneratorService,
    MessageGeneratorService, BreadCrumbGeneratorService, CustomerService, ExternalUrlService, ProductService,
    ProviderService, NgTableParams) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.objectFind = {
        customerDocumentNumber: '',
        providerDocumentNumber: ''
      };

      $scope.sales = {
      	customer:{	//busca na base
      		id:'',
      		legalName:'',
      		fantasyName: '',
      		documentNumber: ''
      	},
      	contacts: [{  //novo
      		id:'',
      		name:'',
      		phone:'',
      		phone2:'',
      		email:'',
      		observation:''
      	}],
      	address: {
      		id:'',    //inicia com mesmo do cliente, mas pode alterar disponibilizar um button para limpar os campos
      		cep:'',
      		street:'',
      		number:'',
      		complement:'',
      		neighborhood:'',
      		city:'',
      		state:''
      	},
      	type:'',  //tipo de frete CIF(frete de graça, frete pela industria) e FOB (frete pago pelo cliente)
      	carrier: {
      		id: '',
      		name: ''
      	}
      };

      $scope.removeProduct = function(index){

      };

      $scope.removeProduct = function (index){
        bootbox.confirm({
          size: "small",
          title: "<center><b>ATENÇÃO<b><center>",
          message: '<b>Remover</b> o produto?',
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
              $scope.selectedProductsTable.data.splice(index, 1);
              $scope.$digest();
            }
          }
        });
      };

      $scope.providerProducts = [];

      $scope.getCustomerUsingDocument = function(){
        $scope.isDisabledSearchCustomerDocument = true;
        $scope.customer = null;
        $scope.address = null;
        $scope.contact = null;
        $scope.carrier = null;
        var document = $scope.objectFind.customerDocumentNumber;
        if( !!document && !!document.trim() ){
          MessageGeneratorService.cleanAllMessages();
          document = document.trim().replace(/[^0-9]/g,'');

          CustomerService.getCustomerByDocumentNumber({ id: document },
          function(response){
            $scope.isDisabledSearchCustomerDocument = false;
            $scope.customer = response.content[0];
            $scope.address = angular.copy($scope.customer.address);
            $scope.address.id = null;
            if( !!$scope.customer.contacts && $scope.customer.contacts.length > 0 ){
              $scope.contact = angular.copy( $scope.customer.contacts[0] );
              $scope.contact.id = null;
            }else{
              $scope.contact = {};
            }

            $scope.carrier = {
              type:'CIF'
            };
          }, function(error){
            $scope.isDisabledSearchCustomerDocument = false;
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o CPF/CNPJ informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando o CPF/CNPJ');
            }
          });
        }else{
          $scope.isDisabledSearchCustomerDocument = false;
          MessageGeneratorService.createMessageWarning( 'Por favor insira o número do documento do cliente' );
        }
      };

      $scope.getProviderUsingDocument = function(){
        $scope.isDisabledSearchProviderDocument = true;
        $scope.provider = null;

        var document = $scope.objectFind.providerDocumentNumber;
        if( !!document && !!document.trim() ){
          MessageGeneratorService.cleanAllMessages();
          document = document.trim().replace(/[^0-9]/g,'');

          ProviderService.getProviderByDocumentNumber({ id: document },
          function(response){
            $scope.isDisabledSearchProviderDocument = false;
            $scope.provider = response.content[0];

            $scope.getProductsUsingDocumentOfProvider( $scope.provider.documentNumber );

          }, function(error){
            $scope.isDisabledSearchProviderDocument = false;
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum fornecedor para o CPF/CNPJ informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar fornecedor utilizando o CPF/CNPJ');
            }
          });
        }else{
          $scope.isDisabledSearchProviderDocument = false;
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

      $scope.getProductsUsingDocumentOfProvider = function( documentNumber ){
        documentNumber = documentNumber.trim().replace(/[^0-9]/g,'');
        ProductService.getByProviderDocument( { id: documentNumber },
          function(response){
            $scope.providerProducts = response;

            $scope.selectedProductsTable = new NgTableParams( {} , { dataset: response } );

          }, function(error){
            console.log(error);
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum produto para o fornecedor informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar produto utilizando o forecedor');
            }
          });
      };

      $scope.selectedProducts = [];
      $scope.createNewProduct = function(){
        $scope.selectedProductsTable = new NgTableParams( {} , { dataset: $scope.selectedProducts } );
      };

    }
  ]);
})();
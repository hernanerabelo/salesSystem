(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesSaveCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'BreadCrumbGeneratorService', 'CustomerService',
    function($scope, $rootScope, $location, SalesService, ButtonGeneratorService,
    MessageGeneratorService, BreadCrumbGeneratorService, CustomerService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.objectFind = {
        customerDocumentNumber: ''
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
      $scope.providerProducts = [];

      $scope.getCustomerUsingDocument = function(){
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
            if( error.status == '404'){
              MessageGeneratorService.createMessageWarning('Não foi encontrado nenhum cliente para o CPF/CNPJ informado');
            }else{
              MessageGeneratorService.createMessageWarning('Erro ao buscar cliente utilizando o CPF/CNPJ');
            }
          });
        }else{
          MessageGeneratorService.createMessageWarning( 'Por favor insira o número do documento do cliente' );
        }
      };

      $scope.populateAddressUsingCep = function(cep){
      //todo popular info do endereço
        $scope.isDisabledSearchCep = true;
      };

      $scope.createNewProduct = function(){

      };

    }
  ]);
})();
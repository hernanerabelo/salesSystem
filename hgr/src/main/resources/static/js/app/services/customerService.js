'use strict'

angular.module('app')
.service('customerService', function ($rootScope, $location, $http) {
  var customers =[
                   {
                     id: 1,
                     fantasyName: 'Hernane Batista Rabelo Davi',
                     documentNumber: '09021298643',
                     address:{
                       id: 5,
                       state: 'Minas Gerais',
                       cep: '38408-236'
                     }
                   },
                   {
                     id: 2,
                     fantasyName: 'Henrique Batista Rabelo',
                     documentNumber: '02023293645',
                     address:{
                       id: 5,
                       state: 'Goias',
                       cep: '38408-222'
                     }
                   },
                   {
                     id: 2,
                     fantasyName: 'Rabelo & CIA',
                     documentNumber: '234234234234234242',
                     address:{
                       id: 5,
                       state: 'Goias',
                       cep: '38408-222'
                     }
                   }
                 ];
  return {
    getCustomerByDocumentNumber: function getCustomerByDocumentNumber(documentNumber){
      var customersAux = [];
      for( var i = 0; i < customers.length; i++){
        if(customers[i].documentNumber == documentNumber){
          customersAux.push(customers[i]);
        }
      }
      return customersAux;
    },
    getCustomerByFantasyName: function getCustomerByFantasyName(fantasyName){
      var customersAux = [];
      for( var i = 0; i < customers.length; i++){
        if(customers[i].fantasyName.includes(fantasyName)){
          customersAux.push(customers[i]);
        }
      }
      return customersAux;
    },
    getCustomers: function getCustomers(){
      return customers;
    },
    saveCustomer: function saveCustomer(customer){
      console.log(customer);
      $http({
          url: '/hbr/customer',
          method: "POST",
          data: customer
      })
      .then(function(response) {
        console.log("success");
        console.log(response);
      },
      function(error) {
        console.log("error");
        console.log(error);
      });
    }
  }
});
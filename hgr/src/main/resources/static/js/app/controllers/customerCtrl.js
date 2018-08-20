'use strict';

var app = angular.module('app');

app.controller('CustomerCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    function findCustomer(){
        return [
          {
            id: 1,
            name: 'Hernane Batista Rabelo Davi',
            documentNumber: '09021298643',
            address:{
              id: 5,
              state: 'Minas Gerais',
              cep: '38408-236'
            }
          },
          {
            id: 2,
            name: 'Henrique Batista Rabelo',
            documentNumber: '02023293645',
            address:{
              id: 5,
              state: 'Goias',
              cep: '38408-222'
            }
          },
          {
            id: 2,
            name: 'Rabelo & CIA',
            documentNumber: '234234234234234242',
            address:{
              id: 5,
              state: 'Goias',
              cep: '38408-222'
            }
          }
        ];
    }

    $scope.objectFind = {
      name: null,
      document: null
    };

    $rootScope.menuButtons = [
      {
        title: 'Buscar',
        type: 'primary',
        execute: function( ){
          $rootScope.menuMessages = [];
          if( !!$scope.objectFind.name && !!$scope.objectFind.name.trim() ){
            console.log("testando o primeiro " + $scope.objectFind.name );

          }else if( $scope.objectFind.document && !!$scope.objectFind.document.trim() ){
            console.log("testando o segundo " + $scope.objectFind.document );

          }else{
            console.log("testando o terceiro" );
            $rootScope.menuMessages = [
              {
                title: 'Inserir nome ou número do documento para fazer a busca do cliente',
                type: 'warning'
              }
            ];
          }
        }
      },
      {
        title: 'Novo Cliente',
        type: 'success'
      }
    ];

    $scope.customers = findCustomer();



//    $rootScope.menuMessages = [
//          {
//            title: 'test1',
//            type: 'success'
//          },
//          {
//            title: 'test2',
//            type: 'danger'
//          },
//          {
//            title: 'test3',
//            type: 'warning'
//          }
//        ];
  }
]);

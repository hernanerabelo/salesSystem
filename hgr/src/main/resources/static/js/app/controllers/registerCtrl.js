(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('RegisterCtrl', [ '$scope', '$location', 'BreadCrumbGeneratorService',
    function( $scope, $location, BreadCrumbGeneratorService ) {

       BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();

      $scope.redirect = function(url){
        $location.url( '/cadastros/' + url );
      };

      $scope.subMenus = [
        {
          name: 'Clientes',
          url: 'clientes',
          icon: ''
        },
        {
          name: 'Fornecedores',
          url: 'fornecedores',
          icon: ''
        },
        {
          name: 'Produtos',
          url: 'produtos',
          icon: ''
        }
      ];


    }
  ]);
})();
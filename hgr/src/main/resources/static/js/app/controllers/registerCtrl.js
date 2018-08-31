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
          icon: 'glyphicon glyphicon-zoom-in'
        },
        {
          name: 'Fornecedores',
          url: 'fornecedores',
          icon: 'glyphicon glyphicon-zoom-in'
        },
        {
          name: 'Produtos',
          url: 'produtos',
          icon: 'glyphicon glyphicon-zoom-in'
        },
        {
          name: 'Transportadoras',
          url: 'transportadoras',
          icon: 'glyphicon glyphicon-zoom-in'
        }
      ];


    }
  ]);
})();
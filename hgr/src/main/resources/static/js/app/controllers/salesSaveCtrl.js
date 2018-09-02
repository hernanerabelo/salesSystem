(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('SalesSaveCtrl', ['$scope', '$rootScope', '$location', 'SalesService', 'ButtonGeneratorService',
    'MessageGeneratorService', 'BreadCrumbGeneratorService',
    function($scope, $rootScope, $location, SalesService, ButtonGeneratorService,
    MessageGeneratorService, BreadCrumbGeneratorService) {

      BreadCrumbGeneratorService.updateBreadCrumbUsingLocation();
      console.log('Controlador para salvar venda');


    }
  ]);
})();
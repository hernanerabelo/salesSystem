(function() {
  'use strict';

  var app = angular.module('app', ['ngRoute', 'ngResource']);

  app.config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider
        .when("/", {
          templateUrl: "views/home.html"
        })
        .when("/clientes", {
          templateUrl: "views/customer-find.html",
          controller: "CustomerCtrl"
        })
        .when("/clientes/editar/:id", {
          templateUrl: "views/customer-edit.html",
          controller: "CustomerEditCtrl"
        })
        .when("/clientes/novo", {
          templateUrl: "views/customer-new.html",
          controller: "CustomerSaveCtrl"
        })
        .when("/vendas", {
          templateUrl: "views/sales-find.html"
        })
        .when("/relatorios", {
          templateUrl: "views/report-find.html"
        })
        .otherwise({
          redirectTo: '/'
        });
    })
    .run(function($rootScope, $location,MessageGeneratorService, ButtonGeneratorService) {
      $rootScope.$on('$locationChangeStart', function() {
        MessageGeneratorService.cleanAllMessages();
        ButtonGeneratorService.cleanAllButtons();

        var url = $location.url();
        if( !!url ){
          var paths = url.split('/');
          $rootScope.global = {};
          if( paths.length > 1 && paths[1] != '' ){
            $rootScope.global.menuName = paths[1].toUpperCase();
          }else{
            $rootScope.global.menuName = 'INICIO';
          }
        }

      });
    });
})();
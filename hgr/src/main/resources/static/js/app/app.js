(function() {
  'use strict'

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
        });;
    })
    .run(function($rootScope) {
      $rootScope.$on('$locationChangeStart', function() {
        $rootScope.menuButtons = [];
        $rootScope.menuMessages = [];

      });
    });
})();
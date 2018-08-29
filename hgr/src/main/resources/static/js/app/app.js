(function() {
  'use strict';

  var app = angular.module('app', ['ngRoute', 'ngResource', 'ngTable']);

  app.config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider
        .when("/", {
          templateUrl: "views/home.html"
        })
        .when("/cadastros", {
          templateUrl: "views/subMenu.html",
          controller: "RegisterCtrl"
        })
        .when("/cadastros/clientes", {
          templateUrl: "views/customer-find.html",
          controller: "CustomerCtrl"
        })
        .when("/cadastros/clientes/editar/:id", {
          templateUrl: "views/customer-edit.html",
          controller: "CustomerEditCtrl"
        })
        .when("/cadastros/clientes/novo", {
          templateUrl: "views/customer-new.html",
          controller: "CustomerSaveCtrl"
        })
        .when("/cadastros/fornecedores", {
          templateUrl: "views/provider-find.html",
          controller: "ProviderCtrl"
        })
        .when("/cadastros/fornecedores/editar/:id", {
          templateUrl: "views/provider-edit.html",
          controller: "ProviderEditCtrl"
        })
        .when("/cadastros/fornecedores/novo", {
          templateUrl: "views/provider-new.html",
          controller: "ProviderSaveCtrl"
        })

        .when("/cadastros/produtos", {
          templateUrl: "views/product-find.html",
          controller: "ProductCtrl"
        })
        .when("/cadastros/produtos/editar/:id", {
          templateUrl: "views/product-edit.html",
          controller: "ProductEditCtrl"
        })
        .when("/cadastros/produtos/novo", {
          templateUrl: "views/product-new.html",
          controller: "ProductSaveCtrl"
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
    .run(function($rootScope, $location, MessageGeneratorService, ButtonGeneratorService, BreadCrumbGeneratorService) {
      $rootScope.$on('$locationChangeStart', function() {
        MessageGeneratorService.cleanAllMessages();
        ButtonGeneratorService.cleanAllButtons();
        BreadCrumbGeneratorService.cleanAllBreadCrumb();

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
(function() {
  'use strict';

  var app = angular.module('app');

  app.controller('MenuCtrl', ['$scope',
    function($scope) {
      $scope.currentMenu = function currentMenu(menu) {
        for (var i = 0; i < $scope.menus.length; i++) {
          $scope.menus[i].enable = false;
        }
        if (!!menu) {
          menu.enable = true;
        }
      };

      $scope.removeMessage = function removeMessage(index) {
        $scope.menuMessages.splice(index, 1);
      };

      $scope.executeButton = function executeButton(button) {
        button.execute();
      };

      $scope.menus = [{
          enable: false,
          name: 'Início',
          displayValue: 'INICIO',
          url: "#/",
          icon: ['glyphicon','glyphicon-home']
        },
        {
          enable: false,
          name: "Clientes",
          displayValue: 'CLIENTES',
          url: "#/clientes",
          icon: ['glyphicon','glyphicon-list-alt']
        },
        {
          enable: false,
          name: "Vendas",
          displayValue: 'VENDAS',
          url: "#/vendas",
          icon: ['glyphicon','glyphicon glyphicon-usd']
        },
        {
          enable: false,
          name: "Relatórios",
          displayValue: 'RELATORIOS',
          url: "#/relatorios",
          icon: ['glyphicon','glyphicon-folder-open']
        },
        {
          enable: false,
          name: "Fornecedores",
          displayValue: 'FORNECEDORES',
          url: "#/relatorios",
          icon: ['glyphicon','glyphicon glyphicon-user']
        },
        {
          enable: false,
          name: "Produtos",
          displayValue: 'PRODUTOS',
          url: "#/relatorios",
          icon: ['glyphicon','glyphicon-shopping-cart']
        }
      ];
    }
  ]);
})();
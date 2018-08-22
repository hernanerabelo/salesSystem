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
      }

      $scope.removeMessage = function removeMessage(index) {
        $scope.menuMessages.splice(index, 1);
      }

      $scope.executeButton = function executeButton(button) {
        button.execute();
      }

      $scope.menus = [{
          enable: false,
          name: "Início",
          url: "#/"
        },
        {
          enable: false,
          name: "Clientes",
          url: "#/clientes"
        },
        {
          enable: false,
          name: "Vendas",
          url: "#/vendas"
        },
        {
          enable: false,
          name: "Relatórios",
          url: "#/relatorios"
        },
        {
          enable: false,
          name: "Fornecedor",
          url: "#/relatorios"
        },
        {
          enable: false,
          name: "Produtos",
          url: "#/relatorios"
        }
      ];
    }
  ]);
})();
(function() {
  'use strict';

  //button example
  //{
  //  title: 'Salvar',
  //  type: 'success',
  //  isDisabled: false,
  //  icon: 'glyphicon glyphicon-search'
  //  execute: function(){
  //  }
  //}
  angular.module('app')
    .service('ButtonGeneratorService',['$rootScope',
      function( $rootScope) {
        function concatListInRootScope(list) {
          for (var i = 0; i < list.length; i++) {
            $rootScope.menuButtons.push(list[i]);
          }
        }

        return {
          putButtonsInSubMenu: function putButtonsInSubMenu(buttons) {
            $rootScope.menuButtons = [];

            var buttonPrimary = [];
            var buttonSuccess = [];
            var buttonInfo = [];
            var buttonWarning = [];
            var buttonDanger = [];

            for (var i = 0; i < buttons.length; i++) {
              if (buttons[i].type.toUpperCase() == 'PRIMARY') {
                buttonPrimary.push(buttons[i]);
              } else if (buttons[i].type.toUpperCase() == 'SUCCESS') {
                buttonSuccess.push(buttons[i]);
              } else if (buttons[i].type.toUpperCase() == 'INFO') {
                buttonInfo.push(buttons[i]);
              } else if (buttons[i].type.toUpperCase() == 'WARNING') {
                buttonWarning.push(buttons[i]);
              } else if (buttons[i].type.toUpperCase() == 'DANGER') {
                buttonDanger.push(buttons[i]);
              }
            }
            concatListInRootScope(buttonSuccess);
            concatListInRootScope(buttonInfo);
            concatListInRootScope(buttonWarning);
            concatListInRootScope(buttonDanger);
            concatListInRootScope(buttonPrimary);
          },
          enableButtons: function() {
            if (!!$rootScope.menuButtons) {
              for (var i = 0; i < $rootScope.menuButtons.length; i++) {
                if (!!$rootScope.menuButtons[i].isDisabled) {
                  $rootScope.menuButtons[i].isDisabled = false;
                }
              }
            }
          },
          cleanAllButtons: function(){
            $rootScope.menuButtons = [];
          }
        };
      }
    ]);
})();
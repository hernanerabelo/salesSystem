(function() {
  'use strict';

// message example
//  {
//    title: '',
//    type: '',
//    message: ''
//  }
  angular.module('app')
    .service('MessageGeneratorService',
      function($rootScope) {
        return {
          createMessageWarning: function putButtonsInSubMenu(title, message) {
            window.scrollTo(0, 0);
            $rootScope.menuMessages.push({
              title: title,
              type: 'warning',
              message: message
            });
          },
          createMessageError: function putButtonsInSubMenu(title, message) {
            window.scrollTo(0, 0);
            $rootScope.menuMessages.push({
              title: title,
              type: 'danger',
              message: message
            });
          },
          createMessageSuccess: function putButtonsInSubMenu(title, message) {
            window.scrollTo(0, 0);
            $rootScope.menuMessages.push({
              title: title,
              type: 'success',
              message: message
            });
          },
          createMessageInfo: function putButtonsInSubMenu(title, message) {
            window.scrollTo(0, 0);
            $rootScope.menuMessages.push({
              title: title,
              type: 'info',
              message: message
            });
          },
          cleanAllMessages: function() {
            $rootScope.menuMessages = [];
          }
        };
      }
    );
})();
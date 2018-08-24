(function() {
  'use strict';


  var app = angular.module('app');

  app.directive('hbrUppercase', [

    // Directive
    function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
          ctrl.$parsers.push(function(input) {
            return input ? input.toUpperCase() : "";
          });
          ctrl.$formatters.push(function(input) {
            return input ? input.toUpperCase() : "";
          });
          element.css("text-transform","uppercase");
        }
      };
    }
  ]);
})();
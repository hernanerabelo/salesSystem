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
  ])
  .directive('cpfCnpjFormat', [ function(){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl ) {

        function formatDoc( value ){
          if( !!value ){
            value = value.replace(/[^0-9]/g,'');
            if( value.length == 11){
              value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            } else if( value.length == 14 ){
              value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            }
          }
          return value;
        }

        element.bind('keyup', function() {
          if( !!ctrl.$viewValue ) {
            ctrl.$setViewValue( formatDoc( ctrl.$viewValue ) );
            ctrl.$render();
          }
        });

        ctrl.$parsers.push(function(input) {
          return input ? formatDoc(input) : "";
        });

        ctrl.$formatters.push(function(input) {
          return input ? formatDoc(input) : "";
        });
      }
    };
  }]);
})();
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
  app.directive('hbrInputSearchValue', [

      function() {
        return {
          restrict: 'E',
          scope: {
            title: '@',
            subTitle: '@',
            value: '=',
            enableSearch: '='
          },
          templateUrl: 'views/directives/inputSearchValue.html',
          link: function(scope, element, attrs, ctrl) {

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

        element.bind('keyup', function(event) {
          if( !!ctrl.$viewValue &&
              ( (
                  'Backspace' != event.key &&
                  'Delete' != event.key &&
                  !/[^0-9]/g.test( ctrl.$viewValue )
                ) ||
                ctrl.$viewValue.replace(/[^0-9]/g,'').length == 14
              ) ) {

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
  }])
  .directive('moneyFormat', [ function(){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl ) {

        function formatMoney( value ){
          var cents = '00';
          var real = '0';
          if( !!value ){
            value = value.replace(/[^0-9]/g,'');
            value = parseInt(value) + "";
            if( value.length > 2 ) {
              cents = value.substr(-2);
              real = value.substr(0, value.length -2);
            } else if( value.length == 1){
              cents = "0" + value;
            } else if( value.length == 2 ){
              cents = value;
            }
          }
          return real + "." + cents;
        }

        element.bind('keyup', function( ) {
          if( !!ctrl.$viewValue ) {
            ctrl.$setViewValue( formatMoney( ctrl.$viewValue ) );
            ctrl.$render();
          }
        });

        ctrl.$parsers.push(function(input) {
          return input ? formatMoney(input) : "0.00";
        });

        ctrl.$formatters.push(function(input) {
          return input ? formatMoney(input) : "0.00";
        });
      }
    };
  }]);
})();
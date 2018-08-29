(function() {
  'use strict';


  var app = angular.module('app');

  app.filter('hbrCpfCnpjFilter', function(){
    return function(input) {
      if( !!input ){
        input = input.replace(/[^0-9]/g,'');
        if( input.length == 11){
          input = input.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if( input.length == 14 ){
          input = input.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        }
      }
      return input;
    };
  })
  .filter('hbrCEPFilter', function(){
    return function(input) {
      if( !!input ){
        input = input.replace(/[^0-9]/g,'');
        input = input.replace(/^(\d{5})(\d{2})/, "$1-$2");
      }
      return input;
    };
  });
})();
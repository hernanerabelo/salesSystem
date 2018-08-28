(function() {
  'use strict';

// message example
//  {
//    title: '',
//    type: '',
//    message: ''
//  }
  angular.module('app')
    .service('BreadCrumbGeneratorService',
      function($rootScope, $location) {
        return {
          addBreadCrumb: function addBreadCrumb(title, url) {
            $rootScope.breadCrumbs.push({
              title: title,
              url: url,
              active: false
            });
          },
          cleanAllBreadCrumb: function() {
            $rootScope.breadCrumbs = [];
          },
          updateBreadCrumbUsingLocation: function( removeLastPath ) {
            $rootScope.breadCrumbs = [];

            var url = $location.url();
            if( !!url ){
              var paths = url.split('/');
              var removeLastInt = 0;
              if( !!removeLastPath ){
                paths.pop();
              }
              var auxUrl = '';
              for( var i = 0; i < paths.length; i++ ){
                var title = '';
                if( paths[i] && paths[i] != '/'  ){
                  auxUrl = auxUrl + '/' + paths[i];
                  $rootScope.breadCrumbs.push(
                    {
                      title: paths[i],
                      url: auxUrl,
                      active: false
                    }
                  );
                }
              }
              if( $rootScope.breadCrumbs.length > 1 ){
                $rootScope.breadCrumbs[ $rootScope.breadCrumbs.length -1 ].active = true;
              }
            }
          }
        };
      }
    );
})();
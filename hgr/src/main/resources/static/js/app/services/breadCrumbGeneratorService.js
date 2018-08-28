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
          updateBreadCrumbUsingLocation: function( removeLastPath, addPathRemovedInLastBreadCrumb ) {
            $rootScope.breadCrumbs = [];

            var url = $location.url();
            if( !!url ){
              var lastPath = '';
              var paths = url.split('/');
              if( !!removeLastPath ){
                lastPath = paths.pop();
              }
              var auxUrl = '';
              for( var i = 0; i < paths.length; i++ ){
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
                if( !!addPathRemovedInLastBreadCrumb ){
                  $rootScope.breadCrumbs[$rootScope.breadCrumbs.length -1].url =
                    $rootScope.breadCrumbs[$rootScope.breadCrumbs.length -1].url + '/' + lastPath;
                }
              }
            }
          }
        };
      }
    );
})();
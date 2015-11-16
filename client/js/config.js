(function() {
  'use_strict';

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, FacebookProvider) {

      FacebookProvider.init("949380818479862");

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state("home", {
          url: "/",
          templateUrl: "view/home.html",
          controller: "authCtrl"
        })
        .state("toolsApp", {
          abstract: true,
          url: "/toolsApp",
          templateUrl: "view/tools.html",
          controller: "toolsApp",
          authenticate: true
        })
        .state('toolsApp.flowChart', {
          url: "/flowChart",
          templateUrl: "view/flowchart.html",
          controller: "flowChartCtrl",
          authenticate: true
        })
        .state('toolsApp.UML', {
          url: "/UML",
          templateUrl: "view/uml.html",
          controller: "umlCtrl",
          authenticate: true
        });
      $locationProvider.html5Mode(true);
    })
    .run(['$rootScope', '$state', '$log', 'DiatoolsUser', 'fbServices',
      function($rootScope, $state, $log, User, fbServices) {
        $log.info("User is authenticate",User.isAuthenticated());
        $rootScope.$on('$stateChangeStart', function(event, next) {
          if (next.authenticate && !User.isAuthenticated()) {
            event.preventDefault(); //prevent current page from loading
            $state.go("home");
          }
        });
      }
    ]);

})();

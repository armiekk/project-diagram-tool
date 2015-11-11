(function() {
  'use_strict';

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
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
    })
    .run(['$rootScope', '$state', '$log', 'DiatoolsUser',
    function($rootScope, $state, $log, DiatoolsUser) {
      $rootScope.$on('$stateChangeStart', function(event, next) {
        $log.info("show is authenticated",DiatoolsUser.isAuthenticated());
        if (next.authenticate && !DiatoolsUser.isAuthenticated()) {
          event.preventDefault(); //prevent current page from loading
          $state.go("home");
        }
      });
    }]);

})();

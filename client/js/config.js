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
        .state("register", {
          url: "/register",
          templateUrl: "view/register.html",
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
          templateUrl: "view/diagram/flowchart.html",
          controller: "diagramCtrl",
          authenticate: true
        })
        .state('toolsApp.ER', {
          url: "/ER",
          templateUrl: "view/diagram/er.html",
          controller: "diagramCtrl",
          authenticate: true
        })
        .state('toolsApp.Prototype', {
          url: "/Prototype",
          templateUrl: "view/diagram/prototype.html",
          controller: "diagramCtrl",
          authenticate: true
        });
      $locationProvider.html5Mode(true);
    })
    .run(['$rootScope', '$state', '$log', 'AuthService', 'fbServices', '$location',
      function($rootScope, $state, $log, AuthService, fbServices, $location) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          getUser();
          if (next.authenticate && !AuthService.isAuthenticated) {
            event.preventDefault();
            $state.go("home");
          }


        });
        function getUser() {
          if (AuthService.isAuthenticated) {
            AuthService.getCurrent(function(value) {
              $rootScope.userName = value;
              $log.info("in get user", $rootScope.userName);
            });
          }
        }
      }
    ]);

})();

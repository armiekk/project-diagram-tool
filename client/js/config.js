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
        .state("login", {
          url: "/login",
          templateUrl: "view/login.html",
          controller: "authCtrl"
        })
        .state("tools", {
          abstract: true,
          url: "/tools",
          templateUrl: "view/tools.html",
          controller: "diagramCtrl",
          authenticate: true
        })
        .state('tools.flowChart', {
          url: "/flowChart",
          template: "<flowchart-diagram></flowchart-diagram>",
          authenticate: true
        })
        .state('tools.ER', {
          url: "/ER",
          template: "<er-diagram></er-diagram>",
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

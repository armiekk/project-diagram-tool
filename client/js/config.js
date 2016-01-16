(function() {
  'use_strict';

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, FacebookProvider) {

      FacebookProvider.init("673279242812089");

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
        .state('tools.useCase', {
          url: "/useCase",
          template: "<usecase-diagram></usecase-diagram>",
          authenticate: true
        });
      $locationProvider.html5Mode(true);
    })
    .run(['$rootScope', '$state', '$log', 'AuthService', 'fbServices', '$location',
      function($rootScope, $state, $log, AuthService, fbServices, $location) {
        getUser();
        $rootScope.$on('$stateChangeStart', function(event, next) {
          if (next.authenticate && !AuthService.isAuthenticated) {
            event.preventDefault();
            $state.go("home");
          }


        });
        function getUser() {
          if (AuthService.isAuthenticated) {
            AuthService.getCurrent(function(value) {
              $rootScope.credentials = value;
            });
          }
        }
      }
    ]);

})();

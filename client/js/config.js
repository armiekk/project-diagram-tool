(function() {
  'use_strict';

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
    .run(['$rootScope', '$state', '$log', 'DiatoolsUser', '$window',
      function($rootScope, $state, $log, User, $window) {

        $window.fbAsyncInit = function() {
          FB.init({
            appId: '421864941355222',
            channelUrl: './channel.html',
            status: true,
            cookie: true,
            xfbml: true
          });
        };

        $rootScope.$on('$stateChangeStart', function(event, next) {
          $log.info("show is authenticated", User.isAuthenticated());
          if (next.authenticate && !User.isAuthenticated()) {
            event.preventDefault(); //prevent current page from loading
            $state.go("home");
          }
        });

        (function(d) {
          // load the Facebook javascript SDK

          var js,
            id = 'facebook-jssdk',
            ref = d.getElementsByTagName('script')[0];

          if (d.getElementById(id)) {
            return;
          }

          js = d.createElement('script');
          js.id = id;
          js.async = true;
          js.src = "//connect.facebook.net/en_US/all.js";

          ref.parentNode.insertBefore(js, ref);

        }(document));
      }
    ]);

})();

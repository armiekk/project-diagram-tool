(function() {
  'use_strict';

  angular
    .module("app")
    .controller("authCtrl", ["$scope", "$rootScope", "AuthService", "$window", "$state", "$log", "fbServices",
      "Facebook", authCtrl
    ]);

  function authCtrl($scope, $rootScope, AuthService, $window, $state, $log, fbServices, Facebook) {
    $scope.user;
    $scope.register = function() {
      AuthService.register($scope.user.email, $scope.user.password)
        .then(function() {
          $window.alert("Register Successful");
        });
    };
    $scope.login = function(user) {
      AuthService.login(user)
        .then(function() {
          $state.go("toolsApp.flowChart");
        });
    }

    $scope.logout = function() {
      AuthService.logout()
        .then(function() {
          $state.go("home");
        });
    }


    $scope.IntentLogin = fbServices.fbLogin;



    $scope.facebookLogout = fbServices.fbLogout;



    getUser();

    function getUser() {
      if (AuthService.isAuthenticated) {
        AuthService.getCurrent(function(username) {
          $log.info("username", username);
          $scope.user = username;
        });
      }
    }

  }
})();

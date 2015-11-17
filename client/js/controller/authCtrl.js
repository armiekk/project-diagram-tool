(function() {
  'use_strict';

  angular
    .module("app")
    .controller("authCtrl", ["$scope", "$rootScope", "AuthService", "$window", "$state", "$log", "fbServices",
      "Facebook", authCtrl
    ]);

  function authCtrl($scope, $rootScope, AuthService, $window, $state, $log, fbServices, Facebook) {
    getUser();
    $scope.user;
    $scope.modal = {
      login: false,
      overlay: false
    };
    $scope.register = register;
    $scope.login = login;
    $scope.logout = logout;
    $scope.showLoginModal = showLoginModal;
    $scope.closeModal = closeModal;
    $scope.IntentLogin = fbServices.fbLogin;
    $scope.facebookLogout = fbServices.fbLogout;

    function register(user) {
      AuthService.register(user)
        .then(function() {
          $window.alert("Register Successful");
        });
    };

    function login(user) {
      AuthService.login(user)
        .then(function() {
          $state.go("toolsApp.flowChart");
        });
    }

    function logout() {
      AuthService.logout()
        .then(function() {
          $state.go("home");
        });
    }

    function getUser() {
      if (AuthService.isAuthenticated) {
        AuthService.getCurrent(function(username) {
          $log.info("username", username);
          $scope.user = username;
        });
      }
    }

    function showLoginModal(){
      $scope.modal.login = true;
      $scope.modal.overlay = true;
    }

    function closeModal(){
      $scope.modal.login = false;
      $scope.modal.overlay = false;
    }
  }
})();

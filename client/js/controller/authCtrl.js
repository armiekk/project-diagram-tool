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
    $scope.facebookLogin = fbServices.fbLogin;
    $scope.facebookLogout = fbServices.fbLogout;

    function register(user) {
      $scope.passwordMatch = user.password === user.rePassword;
      if ($scope.passwordMatch) {
        AuthService.register(user)
          .then(function() {
            $window.alert("Register Successful");
            $state.go("home");
          });
      }else {
        $window.alert("password not match !");
      }
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

(function() {
  'use_strict';

  angular
    .module("app")
    .controller("authCtrl", ["$scope", "$rootScope", "AuthService", "$window",
    "$state", "$log", "fbServices", "Facebook", "$location", "Flash", "$timeout", authCtrl
    ]);

  function authCtrl($scope, $rootScope, AuthService, $window, $state, $log,
    fbServices, Facebook, $location, Flash, $timeout) {

    $scope.user = $rootScope.userName;
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

    function register(user) {
      var scssMsg = "Register Successful";
      var errMsg = "<strong>Register Unsuccessful!</strong> <br> E-mail or Username has been used.";
      AuthService.register(user, function(cbMsg) {
        if (cbMsg === scssMsg) {
          Flash.create('success', "Register Successful", 'flash-register-class');
          $timeout(function(){
            $state.go("login");
          },3000);
        } else {
          Flash.create('success', errMsg, 'flash-register-class');
        }
      });
    };

    function login(user) {
      var errMsg = "Username or password wrong!";
      AuthService.login(user, function(result) {
        if (result == 401) {
          Flash.create('success', errMsg, 'flash-register-class');
        }else {
          $rootScope.credentials = {
            userName: result.user.username,
            userId: result.userId
          };
          $state.go("tools.flowChart");
        }
      });
    }

    function logout() {
      AuthService.logout()
        .then(function() {
          $state.go("home");
          $rootScope.credentials = undefined;
        });
    }

    function showLoginModal() {
      $scope.modal.login = true;
      $scope.modal.overlay = true;
    }

    function closeModal() {
      $scope.modal.login = false;
      $scope.modal.overlay = false;
    }


  }
})();

(function(){
  'use_strict';

  angular
    .module("app")
    .controller("authCtrl", ["$scope", "AuthService", "$window", "$state", "$log", authCtrl]);

    function authCtrl($scope, AuthService, $window, $state, $log){
      $scope.user = {};
      $scope.register = function() {
        AuthService.register($scope.user.email, $scope.user.password)
          .then(function() {
            $window.alert("Register Successful");
          });
        };
      $scope.login = function(user){
        AuthService.login(user.email, user.password)
          .then(function(){
            $state.go("toolsApp.flowChart");
          });
      }

      $scope.logout = function(){
        AuthService.logout()
          .then(function(){
            $state.go("home");
          });
      }

      getUser();

      function getUser(){
        AuthService.getCurrent().$promise.then(function(value){
          $scope.currentUser = value.email;
          $log.info($scope.currentUser);
        });

      }

    }
})();

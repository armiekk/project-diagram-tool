(function() {
  'use_strict';

  angular
    .module("app")
    .factory("AuthService", ["DiatoolsUser", "$q", "$rootScope", "$log", AuthService]);

  function AuthService(User, $q, $rootScope, $log) {

    function login(user, callback) {
      return User
        .login(user, function(value, responseHeaders){
          callback(value);
        }, function(httpResponse){
          callback(httpResponse.status);
        });
    }

    function logout() {
      return User
        .logout()
        .$promise;
    }

    function register(user, callback) {
      User.create(user, function(value, responseHeaders) {
        callback("Register Successful");
        $log.info("register Successful", value);
      }, function(httpResponse){
        $log.info("register error", httpResponse);
        callback("Register Unsuccessful");
      });
    }

    function getCurrent(getValueBack) {
      User.getCurrent(function(value, responseHeaders) {
        var credentials = {
          userName: value.username,
          userId: value.userId
        };
        getValueBack(credentials);
      }, function(httpResponse) {

      });
    }

    function isAuthenticated() {
      return User.isAuthenticated();
    }

    return {
      login: login,
      logout: logout,
      register: register,
      getCurrent: getCurrent,
      isAuthenticated: isAuthenticated
    };
  }
})();

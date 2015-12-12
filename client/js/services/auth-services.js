(function() {
  'use_strict';

  angular
    .module("app")
    .factory("AuthService", ["DiatoolsUser", "$q", "$rootScope", "$log", AuthService]);

  function AuthService(User, $q, $rootScope, $log) {

    function login(user) {
      return User
        .login(user)
        .$promise;
    }

    function logout() {
      return User
        .logout()
        .$promise;
    }

    function register(user) {
      return User
        .create(user)
        .$promise;
    }

    function getCurrent(getValueBack) {
      User.getCurrent(function(value, responseHeaders) {
        getValueBack(value.username);
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

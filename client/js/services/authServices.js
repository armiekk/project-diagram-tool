(function(){
  'use_strict';

  angular
    .module("app")
    .factory("AuthService", ["DiatoolsUser", "$q", "$rootScope", "$log", AuthService]);

    function AuthService(User, $q, $rootScope, $log){
      function login(email, password) {
        return User
          .login({email: email, password: password})
          .$promise
          .then(function(response) {
            $log.info(response);
          });
      }

      function logout() {
        return User
         .logout()
         .$promise
         .then(function() {
           $rootScope.currentUser = null;
         });
      }

      function register(email, password) {
        return User
          .create({
           email: email,
           password: password
         })
         .$promise;
      }

      function getCurrent(){
        return User
          .getCurrent(function(value, responseHeaders){
            $log.info(value);
            return value;
          }, function(httpResponse){
            $log.info(httpResponse);
          });

      }

      return {
        login: login,
        logout: logout,
        register: register,
        getCurrent: getCurrent
      };
    }
})();

(function(){
  'use_strict';

  angular
    .module("app")
    .factory("AuthService", ["DiatoolsUser", "$q", "$rootScope", "$log", AuthService]);

    function AuthService(DiatoolsUser, $q, $rootScope, $log){
      function login(email, password) {
        return DiatoolsUser
          .login({email: email, password: password})
          .$promise
          .then(function(response) {
            $log.info(response);
          });
      }

      function logout() {
        return DiatoolsUser
         .logout()
         .$promise
         .then(function() {
           $rootScope.currentUser = null;
         });
      }

      function register(email, password) {
        return DiatoolsUser
          .create({
           email: email,
           password: password
         })
         .$promise;
      }

      function getCurrent(){
        return DiatoolsUser
          .getCurrent(function(value, responseHeaders){
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

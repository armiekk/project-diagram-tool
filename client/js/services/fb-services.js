(function() {
  'use_strict';

  angular.module("app")
    .factory("fbServices", ["Facebook", "$state", "$log", "AuthService", "base64",
    '$rootScope', fbServices]);

  function fbServices(Facebook, $state, $log, AuthService, base64, $rootScope) {

    function isConnected(callback) {
      var userIsConnected = false;
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          userIsConnected = true;
        }
        callback(userIsConnected);
      });
    }

    function me(callback) {
      Facebook.api("/me", function(profile) {
        callback(profile);
      });
    }

    function fbLogin(callbackUser) {
      return isConnected(function(status) {
        var emailPattern = "@facebook.com";
        if (!status) {
          Facebook.login(function(response) {
            if (response.status == "connected") {
              me(function(profile) {
                var user = {
                  email: profile.id+emailPattern,
                  username: profile.name,
                  password: base64.encode(profile.name + profile.id)
                };
                AuthService.register(user).then(function() {
                  AuthService.login(user)
                    .then(function(response) {
                      $rootScope.userName = response.user.username;
                      $state.go("tools.flowChart");
                    });
                });
              });
            }
          });
        } else {
          me(function(profile) {
            var user = {
              email: profile.id+emailPattern,
              username: profile.name,
              password: base64.encode(profile.name + profile.id)
            };
            AuthService.login(user)
              .then(function(response) {
                $rootScope.userName = response.user.username;
                $state.go("tools.flowChart");
              });
          });
        }
      });
    }

    return {
      fbLogin: fbLogin
    }
  }
})();

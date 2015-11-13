(function() {
  'use_strict';

  angular.module("app")
    .factory("fbServices", ["Facebook", "$state", "$log", "AuthService", "base64", fbServices]);

  function fbServices(Facebook, $state, $log, AuthService, base64) {

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
                    .then(function() {
                      $state.go("toolsApp.flowChart");
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
              .then(function() {
                $state.go("toolsApp.flowChart");
              });
          });
        }
      });
    }

    function fbLogout() {
      return Facebook.logout(function() {
        $log.info("Log out Facebook");
        $state.go("home");
      });
    }

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

    return {
      fbLogin: fbLogin,
      fbLogout: fbLogout,
      isConnected: isConnected,
    }
  }
})();

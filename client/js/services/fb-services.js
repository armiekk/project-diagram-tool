(function() {
  'use_strict';

  angular.module("app")
    .factory("fbServices", ["Facebook", "$state", "$log", "AuthService", "base64",
    "$rootScope", "Flash", fbServices]);

  function fbServices(Facebook, $state, $log, AuthService, base64, $rootScope, Flash) {

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
      var errMsg = "Cannot connect with Facebook!";
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
          });
        }
      });
    }

    return {
      fbLogin: fbLogin
    }
  }
})();

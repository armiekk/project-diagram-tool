(function(){
  'use_strict';
  angular
    .module("app")
    .controller("toolsApp", ["$scope", toolsApp]);

    function toolsApp($scope){
      $scope.modal = {
        overlay: false,
        drawer: false
      };

      $scope.closeModal = closeModal;
      $scope.openDrawer = openDrawer;

      function openDrawer(e){
        e.preventDefault();
        $scope.modal.overlay = true;
        $scope.modal.drawer = true;
      }

      function closeModal(){
        var modalObj = $scope.modal;
        for(var key in modalObj){
          modalObj[key] = false;
        }
      }
    }
})();

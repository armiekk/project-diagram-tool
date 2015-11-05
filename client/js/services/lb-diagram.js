(function(){
  'use_strict';

  angular.module('app')
    .factory('DiagramServices', ['$scope', '$log', '$window', 'Diagram', diagram]);

    function diagram($scope, $log, $window, Diagram){

      function createDiagram(diagramParam){
        Diagram.create(diagramParam, function(value, responseHeaders){
          $console.log(value);
          $console.log(responseHeaders);
        }, function(httpResponse){
          $log.info(httpResponse);
        });
      }

      return {
        create: createDiagram
        // find: findDiagram,
        // update: updateDiagram,
        // delete: deleteDiagram
      };
    }
})();

(function(){
  'use_strict';

  angular.module('app')
    .factory('DiagramServices', ['$rootScope', '$log', '$window', 'DiatoolsUser',
    'GoJS', 'SaveFile', diagram]);

    function diagram($rootScope, $log, $window, User, GoJS, SaveFile){



      function createDiagram(diagramParam, callback){
        var userId = $rootScope.credentials.userId;
        diagramParam.diagramDetail = JSON.parse(diagramParam.diagramDetail.toJson());
        User.diagrams.create({ id: userId },diagramParam, function(value, responseHeaders){
          callback("create diagram successful");
        }, function(httpResponse){
          $log.info("cannot create diagram");
        });
      }

      function loadDiagramList(idParam, callback) {
        User.diagrams({ id: idParam }, function(value, responseHeaders){
          callback(value);
        }, function(httpResponse){
          $log.info("load diagram list error");
        });
      }

      function exportJSON(diagramParam) {
        SaveFile.saveJson(diagramParam.diagramName, diagramParam.diagramDetail);
      }

      function exportImage(diagramParam, init) {
        var imageDetail = init.makeImage({
          scale: 1,
          background: "rgba(255, 255 ,255, 1)",
          type: "image/png"
        });
        var canvas = document.createElement('canvas');
        canvas.width = imageDetail.width, canvas.height = imageDetail.height;
        context = canvas.getContext('2d');
        context.drawImage(imageDetail, 0, 0);
        $log.info("canvas",canvas);
        SaveFile.saveImage(diagramParam.diagramName, canvas);
      }

      function updateDiagram(diagramParam, callback){
        var userId = $rootScope.credentials.userId;
        User.diagrams.updateById(
          { id: userId, fk: diagramParam.diagramId },
          diagramParam, function(value, responseHeaders){
            callback("update successful");
          }, function(httpResponse){
            callback("update unsuccessful");
          });

      }

      function deleteDiagram(diagramId, callback){
        var userId = $rootScope.credentials.userId;
        User.diagrams.destroyById(
          { id: userId },
          { fk: diagramId },
          function(value, responseHeaders){
            callback("delete diagram successful");
          }, function(httpResponse){
            callback("delete diagram unsuccessful");
          });
      }

      return {
        createDiagram: createDiagram,
        loadDiagramList: loadDiagramList,
        exportJSON: exportJSON,
        exportImage: exportImage,
        updateDiagram: updateDiagram,
        deleteDiagram: deleteDiagram
      };
    }
})();

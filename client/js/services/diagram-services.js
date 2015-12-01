(function(){
  'use_strict';

  angular.module('app')
    .factory('DiagramServices', ['$rootScope', '$log', '$window', 'Diagram',
    'GoJS', 'SaveFile', diagram]);

    function diagram($rootScope, $log, $window, Diagram, GoJS, SaveFile){


      function createDiagram(diagramParam, callback){
        diagramParam.diagramDetail = JSON.parse(diagramParam.diagramDetail.toJson());
        $log.info("in service", diagramParam);
        Diagram.create(diagramParam, function(value, responseHeaders){
          callback();
        }, function(httpResponse){
          $log.info("cannot create diagram",httpResponse);
        });
      }

      function loadDiagramList(userParam, callback) {
        Diagram.find({
          filter: {
            where: {
              userName : userParam
            }
          }
        }, function(listValue, responseHeaders){
          callback(listValue);
        }, function(httpResponse){
          $log.info("error with load diagram list",httpResponse);
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
        Diagram.update({
          where: {
            and: [{userName: diagramParam.userName}, {diagramName: diagramParam.diagramName}]
          }
        }, diagramParam,
        function(value, responseHeaders){
          $log.info("in update successful");
          callback();
        }, function(httpResponse){
          $log.info(httpResponse);
        });
      }

      function deleteDiagram(diagramId, callback){
        Diagram.deleteById({ id: diagramId },
          function(value, responseHeaders){
            callback("delete successful");
          },
          function(httpResponse){
            callback("delete unsuccessful");
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

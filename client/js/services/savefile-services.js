(function(){
  'use_strict';

  angular
    .module("app")
    .factory("SaveFile", ["$log", saveFile]);

    function saveFile($log){

      function saveJson(fileName, data){
        var jsonString = data.toJson();
        var blob = new Blob([jsonString], {type: "text/json;charset=utf-8"});
        saveAs(blob, fileName+".json");
      }

      function saveImage(fileName, data){
        data.toBlob(function(blob){
          saveAs(
            blob,
            fileName+".png"
          );
        }, "image/png");
      }

      return {
        saveJson: saveJson,
        saveImage: saveImage
      };
    }
})();

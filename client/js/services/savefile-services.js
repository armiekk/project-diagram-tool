(function(){
  'use_strict';

  angular
    .module("app")
    .factory("SaveFile", ["$log", saveFile]);

    function saveFile($log){

      function save(fileName, data){
        $log.info("data ", data);
        var blob = new Blob([data], {type: "text/json;charset=utf-8"});
        saveAs(blob, fileName+".json");
      }

      return {
        save: save
      };
    }
})();

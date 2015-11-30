(function() {
  "use_strict";

  angular
    .module("app")
    .factory("Upload", ["FileUploader", upload]);

  function upload(FileUploader) {

    var fileValid, uploader;

    function init() {
      //import file section
      uploader = new FileUploader({
        url: '/api/containers/container1/upload',
        formData: [{
          key: 'value'
        }]
      });
      //validate JSON file
      uploader.filters.push({
        name: 'validateJSON',
        fn: function(item, options) { // second user filter
          var isJson = item.name.indexOf(".json") > -1;
          if (isJson) {
            console.info("file is json");
            fileValid = false;
            return true;
          } else {
            console.info("not a json file");
            fileValid = true;
            return false;
          }
        }
      });

      return uploader;
    }

    function isValid(){
      return fileValid;
    }


    return {
      init: init,
      isValid: isValid
    };
  }
})();

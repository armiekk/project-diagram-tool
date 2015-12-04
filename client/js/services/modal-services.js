(function(){
  "use_strict";

  angular
    .module("app")
    .factory("Modal", modal);

    function modal(){
      var modal = {
        save : false,
        overlay: false,
        import: false,
        exportJson: false,
        exportImage: false,
        drawer: false
      };
      function modalTrigger(){
        return modal;
      }


      function closeModal(){
        for(var key in modal){
          modal[key] = false;
        }
        return modal;
      }

      return {
        modalTrigger: modalTrigger,
        closeModal: closeModal
      };
    }
})();

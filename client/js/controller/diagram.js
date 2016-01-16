(function() {
  'use_strict';

  angular.module('app')
    .controller("diagramCtrl", ['$scope', '$rootScope', 'GoJS', 'Upload', '$log',
      'DiagramServices', 'Modal', '$http', '$location', 'Flash', 'AuthService', diagramCtrl
    ]);

  function diagramCtrl($scope, $rootScope, GoJS, Upload, $log, DiagramServices,
     Modal, $http, $location, Flash, AuthService) {

    $scope.init = GoJS.initDiagram();
    $scope.diagramList;
    $scope.temp = {};
    $scope.exportName = "new Diagram";
    $scope.myDiagram;
    $scope.modal = Modal.modalTrigger();
    $scope.uploader = Upload.init();

    $scope.uploader.onCompleteItem = onUploadComplete;
    $scope.newDiagram = newDiagram;
    $scope.saveNewDiagram = saveNewDiagram;
    $scope.saveDiagram = saveDiagram;
    $scope.loadDiagram = loadDiagram;
    $scope.selectDiagram = selectDiagram;
    $scope.deleteDiagram = deleteDiagram;
    $scope.closeModal = closeModal;
    $scope.redo = redo;
    $scope.undo = undo;
    $scope.exportJSON = exportJSON;
    $scope.exportImage = exportImage;
    $scope.openDrawer = openDrawer;

    getUser();

    function getUser() {
      if (AuthService.isAuthenticated) {
        AuthService.getCurrent(function(value) {
          $log.info("new instance.");
          $scope.myDiagram = {
            diagramId: undefined,
            userName: value.userName,
            diagramName: "",
            diagramDetail: [],
            category: $location.path().split("/")[2]
          };
          $scope.myDiagram.diagramDetail = $scope.init.model;
          loadDiagramList(value.userId);
        });
      }
    }
    function saveNewDiagram(myDiagram){
      var saveMessage = 'Save "'+ myDiagram.diagramName + '" successful.';
      DiagramServices.createDiagram(myDiagram, function(cbMsg){
        $log.info(cbMsg);
        loadDiagramList($rootScope.credentials.userId);
        closeModal();
        Flash.create('success', saveMessage, 'flash-custom-class');
      });
    }
    function saveDiagram(myDiagram){
      if (myDiagram.diagramName.length == 0) {
        $scope.modal.save = !$scope.modal.save;
        $scope.modal.overlay = !$scope.modal.overlay;
      }else {
        var saveMessage = 'Save "'+ myDiagram.diagramName + '" successful.';
        DiagramServices.updateDiagram(myDiagram, function(cbMsg){
          $log.info(cbMsg);
          loadDiagramList($rootScope.credentials.userId);
          Flash.create('success', saveMessage, 'flash-custom-class');
        });
      }
    }
    function newDiagram() {
      $scope.myDiagram.diagramName = "";
      $scope.myDiagram.diagramId = undefined;
      $scope.init.model = new go.GraphLinksModel();
      $scope.init.model.linkFromPortIdProperty = "fromPort";
      $scope.init.model.linkToPortIdProperty = "toPort";
      $scope.myDiagram.diagramDetail = $scope.init.model;
    }
    function closeModal(){
      $scope.modal = Modal.closeModal();
    }
    function loadDiagramList(userId){
      $log.info("userId",userId);
      DiagramServices.loadDiagramList(userId, function(result) {
        $scope.diagramList = result;
      });
    }
    function loadDiagram(diagramParam){
      $scope.exportName = diagramParam.diagramName;
      $scope.myDiagram.diagramId = diagramParam.diagramId;
      $scope.myDiagram.diagramName = diagramParam.diagramName;
      $scope.myDiagram.diagramDetail = $scope.init.model = go.Model.fromJson(diagramParam.diagramDetail);
    }
    function selectDiagram(diagramParam){
      $scope.temp.diagramId = diagramParam.diagramId;
      $scope.temp.diagramName = diagramParam.diagramName;
    }
    function deleteDiagram(diagramParam){
      var deleteMessage = 'Delete "'+ diagramParam.diagramName + '" successful.';
      var c = confirm("delete "+diagramParam.diagramName+" ?");
      if (c) {
        DiagramServices.deleteDiagram(diagramParam.diagramId, function(cbMsg){
          $log.info(cbMsg);
          loadDiagramList($rootScope.credentials.userId);
          Flash.create('success', deleteMessage, 'flash-custom-class');
        });
      }
    }
    function redo(diagram){
      $scope.myDiagram.diagramDetail = GoJS.redo(diagram);
    }
    function undo(diagram){
      $scope.myDiagram.diagramDetail = GoJS.undo(diagram);
    }
    function exportJSON(exportName, myDiagram){
      $scope.exportName = "new Diagram";
      DiagramServices.exportJSON(exportName, myDiagram);
      closeModal();
    }
    function exportImage(exportName, init){
      $scope.exportName = "new Diagram";
      var canvas = document.createElement('canvas');
      DiagramServices.exportImage(exportName, canvas, init);
      closeModal();
    }
    function onUploadComplete(item, response, status, headers) {
      console.info('Complete', item.file.name);
      $http.get('/api/containers/container1/download/' + item.file.name).then(function(value) {
        $scope.init.model = new go.GraphLinksModel();
        $scope.init.model.linkFromPortIdProperty = "fromPort";
        $scope.init.model.linkToPortIdProperty = "toPort";
        $scope.myDiagram.diagramDetail = $scope.init.model = go.Model.fromJson(value.data);
        closeModal();
      });
    };
    function openDrawer(){
      $scope.modal.overlay = true;
      $scope.modal.drawer = true;
    }

  }

})();

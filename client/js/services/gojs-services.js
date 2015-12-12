(function() {
  "use_strict";

  angular
    .module("app")
    .factory("GoJS", gojsServices);

  function gojsServices() {

    var diagram, gojs = go.GraphObject.make;

    function newDiagram() {
      diagram.model = new go.GraphLinksModel();
      diagram.model.linkFromPortIdProperty = "fromPort";
      diagram.model.linkToPortIdProperty = "toPort";
      return diagram.model;
    }

    function initDiagram() {
      diagram =
        gojs(go.Diagram, "myDiagram", {
          grid: gojs(go.Panel, "Grid",
            gojs(go.Shape, "LineH", {
              stroke: "lightgray",
              strokeWidth: 0.5
            }),
            gojs(go.Shape, "LineH", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            }),
            gojs(go.Shape, "LineV", {
              stroke: "lightgray",
              strokeWidth: 0.5
            }),
            gojs(go.Shape, "LineV", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            })
          ),
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,
          "animationManager.duration": 800,
          "undoManager.isEnabled": true,
          "draggingTool.isGridSnapEnabled": true
        });

        return diagram;
    }

    function undo(diagram){
      if (diagram.undoManager.canUndo()) {
        diagram.undoManager.undo();
      }
      return diagram;
    }

    function redo(diagram){
      if (diagram.undoManager.canRedo()) {
        diagram.undoManager.redo();
      }
      return diagram;
    }

    return {
      newDiagram: newDiagram,
      initDiagram: initDiagram,
      undo: undo,
      redo: redo
    }
  }
})();

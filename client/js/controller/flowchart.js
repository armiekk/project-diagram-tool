(function() {
  'use_strict';

  angular.module('app')
    .controller("flowChartCtrl", ['Diagram', '$scope', '$log', '$window', 'FileUploader', '$http', 'AuthService', 'SaveFile',
    flowChartCtrl])
    .controller;

  function flowChartCtrl(Diagram, $scope, $log, $window, FileUploader, $http, AuthService, SaveFile) {

    // properties
    $scope.uploader = new FileUploader();
    $scope.diagramList = [];
    $scope.importButton = true;
    $scope.myDiagram = {
      userName : "",
      diagramName : "",
      diagramDetail: []
    };
    $scope.modal = {
      save : false,
      overlay: false,
      import: false,
      exportJson: false,
      exportImage: false
    };
    $scope.newDiagram = newDiagram;
    $scope.saveModel = saveModel;
    $scope.loadModelList = loadModelList;
    $scope.loadModel = loadModel;
    $scope.selectModel = selectModel;
    $scope.undoButton = undoButton;
    $scope.redoButton = redoButton;
    $scope.saveAsModel = saveAsModel;
    $scope.importModal = importModal;
    $scope.exportJsonModal = exportJsonModal;
    $scope.exportImageModal = exportImageModal;
    $scope.closeModal = closeModal;
    $scope.exportJSON = exportJSON;
    $scope.exportImage = exportImage;
    // -----------------------------------------------------------
    // init function
    getUser();
    initGojs();
    // function
    function getUser() {
      if (AuthService.isAuthenticated) {
        AuthService.getCurrent(function(username) {
          $scope.myDiagram.userName = username;
          $log.info("in get user ",$scope.myDiagram.userName);
          loadModelList($scope.myDiagram.userName);
        });
      }
    }
    function newDiagram(){
      $scope.myDiagram.diagramName = "";
      $scope.myDiagram.diagramDetail = [];
      $scope.diagram.model = new go.GraphLinksModel();
      $scope.diagram.model.linkFromPortIdProperty = "fromPort";
      $scope.diagram.model.linkToPortIdProperty = "toPort";
    }
    function saveAsModel(myDiagram){
      myDiagram.diagramDetail = JSON.parse($scope.diagram.model.toJson());
      $log.info("model ",JSON.parse($scope.diagram.model.toJson()));
      Diagram.create(myDiagram, function(value, responseHeaders){
        $log.info(value);
        closeModal();
        loadModelList(myDiagram.userName);
      }, function(httpResponse){
        $log.info(httpResponse);
      });
    }
    function loadModelList(userParam) {
      $log.info("show user", userParam);
      Diagram.find({
        filter: {
          where: {
            userName : userParam
          }
        }
      }, function(listValue, responseHeaders){
        $scope.diagramList = listValue;
        $log.info("loadModelList ", $scope.diagramList);
      }, function(httpResponse){
        $log.info(httpResponse);
      });
    }
    function loadModel(diagram){
      $log.info(diagram);
      Diagram.findOne({
        filter: {
          where: {
            and: [{userName: diagram.userName}, {diagramName: diagram.diagramName}]
          }
        }
      }, function(value, responseHeaders){
        delete value.diagramId;
        $scope.myDiagram = value;
        $scope.diagram.model = new go.GraphLinksModel();
        $scope.diagram.model.linkFromPortIdProperty = "fromPort";
        $scope.diagram.model.linkToPortIdProperty = "toPort";
        $scope.myDiagram.diagramDetail = $scope.diagram.model = go.Model.fromJson($scope.myDiagram.diagramDetail);
        $log.info("model", $scope.myDiagram);
      },
      function(httpResponse){
        $log.info("cannot load diagram");
      });
    }
    function selectModel(modelName){
      $log.info(modelName);
    }
    function undoButton(){
      if ($scope.diagram.model.undoManager.canUndo()) {
        $scope.diagram.model.undoManager.undo();
      }
    }
    function redoButton(){
      if ($scope.diagram.model.undoManager.canRedo()) {
        $scope.diagram.model.undoManager.redo();
      }
    }
    function saveModel(myDiagram){
      if (myDiagram.diagramName.length == 0) {
        $scope.modal.save = !$scope.modal.save;
        $scope.modal.overlay = !$scope.modal.overlay;
      }else {
        myDiagram.diagramDetail = $scope.diagram.model;
        Diagram.update({
          where: {
            and: [{userName: myDiagram.userName}, {diagramName: myDiagram.diagramName}]
          }
        }, myDiagram,
        function(value, responseHeaders){
          $log.info("in update successful ",myDiagram);
          loadModelList(myDiagram.userName);
        }, function(httpResponse){
          $log.info(httpResponse);
        });
      }
    }
    function importModal(){
      $scope.modal.import = true;
      $scope.modal.overlay = true;
    }
    function exportJsonModal(diagramParam){
      $scope.modal.exportJson = true;
      $scope.modal.overlay = true;
    }
    function exportImageModal(diagramName){
      $scope.modal.exportImage = true;
      $scope.modal.overlay = true;
    }
    function exportJSON(diagramParam) {
      SaveFile.saveJson(diagramParam.diagramName, diagramParam.diagramDetail);
      closeModal();
    }
    function exportImage(diagramName) {
      var imageDetail = $scope.diagram.makeImage({
        scale: 1,
        background: "rgba(255, 255 ,255, 1)",
        type: "image/png"
      });
      $log.info(imageDetail);
      var canvas = document.createElement('canvas');
      canvas.width = imageDetail.width, canvas.height = imageDetail.height;
      context = canvas.getContext('2d');
      context.drawImage(imageDetail, 0, 0);
      SaveFile.saveImage(diagramName, canvas);
      closeModal();
    }
    function closeModal(){
      var modalObj = $scope.modal;
      for(var key in modalObj){
        modalObj[key] = false;
      }
    }
    function initGojs() {
      $scope.g = go.GraphObject.make;
      //diagram
      $scope.diagram =
        $scope.g(go.Diagram, "myDiagram", {
          grid: $scope.g(go.Panel, "Grid",
            $scope.g(go.Shape, "LineH", {
              stroke: "lightgray",
              strokeWidth: 0.5
            }),
            $scope.g(go.Shape, "LineH", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            }),
            $scope.g(go.Shape, "LineV", {
              stroke: "lightgray",
              strokeWidth: 0.5
            }),
            $scope.g(go.Shape, "LineV", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            })
          ),
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,
          "LinkDrawn": showLinkLabel,
          "LinkRelinked": showLinkLabel,
          "animationManager.duration": 800,
          "undoManager.isEnabled": true,
          "draggingTool.isGridSnapEnabled": true
        });

      // helper definitions for node templates

      var nodeSelectionAdornmentTemplate =
            $scope.g(go.Adornment, "Auto",
              $scope.g(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
              $scope.g(go.Placeholder)
            );
      var nodeResizeAdornmentTemplate =
            $scope.g(go.Adornment, "Spot",
              { locationSpot: go.Spot.Right },
              $scope.g(go.Placeholder),
              $scope.g(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
              $scope.g(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
            );

      function nodeStyle() {
        return [
          // The Node.location comes from the "loc" property of the node data,
          // converted by the Point.parse static method.
          // If the Node.location is changed, it updates the "loc" property of the node data,
          // converting back using the Point.stringify static method.
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center,
            //isShadowed: true,
            //shadowColor: "#888",
            // handle mouse enter/leave events to show/hide the ports
            mouseEnter: function(e, obj) {
              showPorts(obj.part, true);
            },
            mouseLeave: function(e, obj) {
              showPorts(obj.part, false);
            }
          }
        ];
      }

      // Define a function for creating a "port" that is normally transparent.
      // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
      // and where the port is positioned on the node, and the boolean "output" and "input" arguments
      // control whether the user can draw links from or to the port.
      function makePort(name, spot, output, input) {
        // the port is basically just a small circle that has a white stroke when it is made visible
        return $scope.g(go.Shape, "Circle", {
          fill: "transparent",
          stroke: null, // this is changed to "white" in the showPorts function
          desiredSize: new go.Size(8, 8),
          alignment: spot,
          alignmentFocus: spot, // align the port on the main Shape
          portId: name, // declare this object to be a "port"
          fromSpot: spot,
          toSpot: spot, // declare where links may connect at this port
          fromLinkable: output,
          toLinkable: input, // declare whether the user may draw links to/from here
          cursor: "pointer" // show a different cursor to indicate potential link point
        });
      }

      $scope.diagram.model.linkFromPortIdProperty = "fromPort";
      $scope.diagram.model.linkToPortIdProperty = "toPort";

      // define the Node templates for regular nodes

      var lightText = 'whitesmoke';

      $scope.diagram.nodeTemplateMap.add("",
       // the default category
        $scope.g(go.Node, "Spot", nodeStyle(),
        { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
        { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $scope.g(go.Panel, "Auto",
            { name: "PANEL"},
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            $scope.g(go.Shape, "Rectangle", {
                fill: "#FAFAFA",
                stroke: "#212121"
              },
              new go.Binding("figure", "figure")),
            $scope.g(go.TextBlock, {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: "#212121",
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, false)
        ));

      $scope.diagram.nodeTemplateMap.add("Start",
        $scope.g(go.Node, "Spot", nodeStyle(),
          { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          $scope.g(go.Panel, "Auto",
            { name: "PANEL" },
            $scope.g(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#FAFAFA",
              stroke: "#212121"
            }),
            $scope.g(go.TextBlock, "Start", {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: "#212121"
              },
              new go.Binding("text"))
          ),
          // three named ports, one on each side except the top, all output only:
          makePort("L", go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, true, false)
        ));

      $scope.diagram.nodeTemplateMap.add("End",
        $scope.g(go.Node, "Spot", nodeStyle(),
          { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          $scope.g(go.Panel, "Auto",
            { name: "PANEL" },
            $scope.g(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#FAFAFA",
              stroke: "#212121"
            }),
            $scope.g(go.TextBlock, "End", {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: "#212121"
              },
              new go.Binding("text"))
          ),
          // three named ports, one on each side except the bottom, all input only:
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, false, true)
        ));

      $scope.diagram.nodeTemplateMap.add("Comment",
        $scope.g(go.Node, "Auto", nodeStyle(),
          { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          $scope.g(go.Shape, "File", {
            fill: "#FAFAFA",
            stroke: "#212121"
          }),
          $scope.g(go.TextBlock, {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif",
              stroke: '#212121'
            },
            new go.Binding("text").makeTwoWay())
          // no ports, because no links are allowed to connect with a comment
        ));


      // replace the default Link template in the linkTemplateMap
      $scope.diagram.linkTemplate =
        $scope.g(go.Link, // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function(e, link) {
              link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
            },
            mouseLeave: function(e, link) {
              link.findObject("HIGHLIGHT").stroke = "transparent";
            }
          },
          new go.Binding("points").makeTwoWay(),
          $scope.g(go.Shape, // the highlight shape, normally transparent
            {
              isPanelMain: true,
              strokeWidth: 8,
              stroke: "transparent",
              name: "HIGHLIGHT"
            }),
          $scope.g(go.Shape, // the link path shape
            {
              isPanelMain: true,
              stroke: "#212121",
              strokeWidth: 2
            }),
          $scope.g(go.Shape, // the arrowhead
            {
              toArrow: "standard",
              stroke: null,
              fill: "#212121"
            }),
          $scope.g(go.Panel, "Auto", // the link label, normally not visible
            {
              visible: false,
              name: "LABEL",
              segmentIndex: 2,
              segmentFraction: 0.5
            },
            new go.Binding("visible", "visible").makeTwoWay(),
            $scope.g(go.Shape, "RoundedRectangle", // the label shape
              {
                fill: "#F8F8F8",
                stroke: null
              }),
            $scope.g(go.TextBlock, "Label", // the label
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true
              },
              new go.Binding("text", "text").makeTwoWay())
          )
        );

      // Make link labels visible if coming out of a "conditional" node.
      // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
      }

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      $scope.diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      $scope.diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

      // load(); // load an initial diagram from some JSON text

      // initialize the Palette that is on the left side of the page
      $scope.myPalette =
        $scope.g(go.Palette, "leftPalette", // must name or refer to the DIV HTML element
          {
            "animationManager.duration": 800, // slightly longer than default (600ms) animation
            nodeTemplateMap: $scope.diagram.nodeTemplateMap, // share the templates used by myDiagram
            model: new go.GraphLinksModel([ // specify the contents of the Palette
              {
                category: "Start",
                text: "Start"
              }, {
                text: "Step"
              }, {
                text: "???",
                figure: "Diamond"
              }, {
                category: "End",
                text: "End"
              }, {
                category: "Comment",
                text: "Comment"
              }
            ])
          });



      // Make all ports on a node visible when the mouse is over the node
      function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function(port) {
          port.stroke = (show ? "#212121" : null);
        });
      }
    }
    $scope.diagram.model.addChangedListener(function(evt){
      if (evt.isTransactionFinished) {
        $log.info($scope.diagram.model.toJson());
      }
    });
    // ----------------------------------------------------------
    //import file section
    $scope.uploader = new FileUploader({
      scope: $scope,
      url: '/api/containers/container1/upload',
      formData: [
        { key: 'value' }
      ]
    });
    //validate JSON file
    $scope.uploader.filters.push({
        name: 'validateJSON',
        fn: function (item, options) { // second user filter
          var isJson = item.name.indexOf(".json") > -1;
            if (isJson) {
              console.info("file is json");
              $scope.importButton = false;
              return true;
            }else {
              console.info("not a json file");
              $scope.importButton = true;
              return false;
            }
        }
    });
    // on clomplete import file
    $scope.uploader.onCompleteItem = onCompleteItem;
    //function
    function onCompleteItem(item, response, status, headers) {
      console.info('Complete', item.file.name);
      $http.get('/api/containers/container1/download/'+item.file.name).then(function (value) {
        console.log("in get method",value.data);
        $scope.diagram.model = new go.GraphLinksModel();
        $scope.diagram.model.linkFromPortIdProperty = "fromPort";
        $scope.diagram.model.linkToPortIdProperty = "toPort";
        $scope.diagram.model = go.Model.fromJson(value.data);
        closeModal();
      });
    };

  }

})();

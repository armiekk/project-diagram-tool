(function() {
  'use_strict';

  angular.module('app')
    .controller("flowChartCtrl", ['Diagram', '$scope', '$log', flowChartCtrl]);

  function flowChartCtrl(Diagram, $scope, $log) {
    initGojs();
    $scope.myDiagram = {
      diagramName : "",
      diagramDetail: []
    };
    $scope.showModal = false;
    $scope.newDiagram = function(){
      $scope.diagram.model = new go.GraphLinksModel();
      $scope.diagram.model.linkFromPortIdProperty = "fromPort";
      $scope.diagram.model.linkToPortIdProperty = "toPort";
    }
    $scope.saveModel = function(myDiagram) {
      $log.info(myDiagram);
      myDiagram.diagramDetail = $scope.diagram.model;
      Diagram.create(myDiagram, function(value, responseHeaders){
        $log.info(value);
        $scope.showModal = !$scope.showModal;
      }, function(httpResponse){
        $log.info(httpResponse);
      });
    }
    $scope.loadModel = function() {
      Diagram.find({}, function(value, responseHeaders){
        delete value.DIAGRAM_ID;
        $scope.diagram.model = go.Model.fromJson(value[0].diagramDetail);
        $log.info(value);
      }, function(httpResponse){
        $log.info(httpResponse);
      });
    }
    $scope.undoButton = function(){
      if ($scope.diagram.model.undoManager.canUndo()) {
        $scope.diagram.model.undoManager.undo();
      }
    }
    $scope.redoButton = function(){
      if ($scope.diagram.model.undoManager.canRedo()) {
        $scope.diagram.model.undoManager.redo();
      }
    }

    $scope.diagram.model.addChangedListener(function(evt){
      if (evt.isTransactionFinished) {
        $log.info($scope.diagram.model.toJson());
      }
    });





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
          "undoManager.isEnabled": true
        });

      // helper definitions for node templates

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

      $scope.diagram.nodeTemplateMap.add("", // the default category
        $scope.g(go.Node, "Spot", nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $scope.g(go.Panel, "Auto",
            $scope.g(go.Shape, "Rectangle", {
                fill: "#00A9C9",
                stroke: null
              },
              new go.Binding("figure", "figure")),
            $scope.g(go.TextBlock, {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: lightText,
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
          $scope.g(go.Panel, "Auto",
            $scope.g(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#79C900",
              stroke: null
            }),
            $scope.g(go.TextBlock, "Start", {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: lightText
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
          $scope.g(go.Panel, "Auto",
            $scope.g(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#DC3C00",
              stroke: null
            }),
            $scope.g(go.TextBlock, "End", {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: lightText
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
          $scope.g(go.Shape, "File", {
            fill: "#EFFAB4",
            stroke: null
          }),
          $scope.g(go.TextBlock, {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif",
              stroke: '#454545'
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
              stroke: "gray",
              strokeWidth: 2
            }),
          $scope.g(go.Shape, // the arrowhead
            {
              toArrow: "standard",
              stroke: null,
              fill: "gray"
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
            $scope.g(go.TextBlock, "Yes", // the label
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
          port.stroke = (show ? "white" : null);
        });
      }
    }
  }

})();

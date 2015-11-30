(function() {
  'use_strict';

  angular
    .module("app")
    .directive("flowchartDiagram", flowchartDiagram)
    .directive("erDiagram", erDiagram);

  function flowchartDiagram() {

    var flowchart = function(scope, elmt, attrs) {

      initGojs();

      function initGojs() {
        scope.g = go.GraphObject.make;
        var diagram = scope.init;

        diagram.LinkDrawn = showLinkLabel;
        diagram.LinkRelinked = showLinkLabel;
        var nodeSelectionAdornmentTemplate =
          scope.g(go.Adornment, "Auto",
            scope.g(go.Shape, {
              fill: null,
              stroke: "deepskyblue",
              strokeWidth: 1.5,
              strokeDashArray: [4, 2]
            }),
            scope.g(go.Placeholder)
          );
        var nodeResizeAdornmentTemplate =
          scope.g(go.Adornment, "Spot", {
              locationSpot: go.Spot.Right
            },
            scope.g(go.Placeholder),
            scope.g(go.Shape, {
              alignment: go.Spot.TopLeft,
              cursor: "nw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Top,
              cursor: "n-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.TopRight,
              cursor: "ne-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Left,
              cursor: "w-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Right,
              cursor: "e-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.BottomLeft,
              cursor: "se-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Bottom,
              cursor: "s-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.BottomRight,
              cursor: "sw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            })
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
          return scope.g(go.Shape, "Circle", {
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

        diagram.model.linkFromPortIdProperty = "fromPort";
        diagram.model.linkToPortIdProperty = "toPort";

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        diagram.nodeTemplateMap.add("",
          // the default category
          scope.g(go.Node, "Spot", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            scope.g(go.Panel, "Auto", {
                name: "PANEL"
              },
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              scope.g(go.Shape, "Rectangle", {
                  fill: "#FAFAFA",
                  stroke: "#212121"
                },
                new go.Binding("figure", "figure")),
              scope.g(go.TextBlock, {
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

        diagram.nodeTemplateMap.add("Start",
          scope.g(go.Node, "Spot", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            scope.g(go.Panel, "Auto", {
                name: "PANEL"
              },
              scope.g(go.Shape, "Circle", {
                minSize: new go.Size(40, 40),
                fill: "#FAFAFA",
                stroke: "#212121"
              }),
              scope.g(go.TextBlock, "Start", {
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

        diagram.nodeTemplateMap.add("End",
          scope.g(go.Node, "Spot", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            scope.g(go.Panel, "Auto", {
                name: "PANEL"
              },
              scope.g(go.Shape, "Circle", {
                minSize: new go.Size(40, 40),
                fill: "#FAFAFA",
                stroke: "#212121"
              }),
              scope.g(go.TextBlock, "End", {
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

        diagram.nodeTemplateMap.add("Comment",
          scope.g(go.Node, "Auto", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            scope.g(go.Shape, "File", {
              fill: "#FAFAFA",
              stroke: "#212121"
            }),
            scope.g(go.TextBlock, {
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
        diagram.linkTemplate =
          scope.g(go.Link, // the whole link panel
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
            scope.g(go.Shape, // the highlight shape, normally transparent
              {
                isPanelMain: true,
                strokeWidth: 8,
                stroke: "transparent",
                name: "HIGHLIGHT"
              }),
            scope.g(go.Shape, // the link path shape
              {
                isPanelMain: true,
                stroke: "#212121",
                strokeWidth: 2
              }),
            scope.g(go.Shape, // the arrowhead
              {
                toArrow: "standard",
                stroke: null,
                fill: "#212121"
              }),
            scope.g(go.Panel, "Auto", // the link label, normally not visible
              {
                visible: false,
                name: "LABEL",
                segmentIndex: 2,
                segmentFraction: 0.5
              },
              new go.Binding("visible", "visible").makeTwoWay(),
              scope.g(go.Shape, "RoundedRectangle", // the label shape
                {
                  fill: "#F8F8F8",
                  stroke: null
                }),
              scope.g(go.TextBlock, "Label", // the label
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
        diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;


        // initialize the Palette that is on the left side of the page
        scope.myPalette =
          scope.g(go.Palette, "erPalette", // must name or refer to the DIV HTML element
            {
              "animationManager.duration": 800, // slightly longer than default (600ms) animation
              nodeTemplateMap: diagram.nodeTemplateMap, // share the templates used by myDiagram
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
    };
    return {
      restrict: "E",
      scope: false,
      link: flowchart,
      template: '<div class="panel-body" id="erPalette" style="width: Auto; height: 500px;"></div>',

    }
  }

  function erDiagram() {

    var flowchart = function(scope, elmt, attrs) {

      initGojs();

      function initGojs() {
        scope.g = go.GraphObject.make;
        var diagram = scope.init;

        diagram.LinkDrawn = showLinkLabel;
        diagram.LinkRelinked = showLinkLabel;
        var nodeSelectionAdornmentTemplate =
          scope.g(go.Adornment, "Auto",
            scope.g(go.Shape, {
              fill: null,
              stroke: "deepskyblue",
              strokeWidth: 1.5,
              strokeDashArray: [4, 2]
            }),
            scope.g(go.Placeholder)
          );
        var nodeResizeAdornmentTemplate =
          scope.g(go.Adornment, "Spot", {
              locationSpot: go.Spot.Right
            },
            scope.g(go.Placeholder),
            scope.g(go.Shape, {
              alignment: go.Spot.TopLeft,
              cursor: "nw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Top,
              cursor: "n-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.TopRight,
              cursor: "ne-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Left,
              cursor: "w-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Right,
              cursor: "e-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.BottomLeft,
              cursor: "se-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.Bottom,
              cursor: "s-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            scope.g(go.Shape, {
              alignment: go.Spot.BottomRight,
              cursor: "sw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            })
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
          return scope.g(go.Shape, "Circle", {
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

        diagram.model.linkFromPortIdProperty = "fromPort";
        diagram.model.linkToPortIdProperty = "toPort";

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        diagram.nodeTemplateMap.add("",
          // the default category
          scope.g(go.Node, "Spot", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            scope.g(go.Panel, "Auto", {
                name: "PANEL"
              },
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              scope.g(go.Shape, "Rectangle", {
                  fill: "#FAFAFA",
                  stroke: "#212121"
                },
                new go.Binding("figure", "figure")),
              scope.g(go.TextBlock, {
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

        diagram.nodeTemplateMap.add("Attribute",
          scope.g(go.Node, "Auto", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            scope.g(go.Panel, "Auto", {
                name: "PANEL"
              },
              scope.g(go.Shape, "Ellipse", {
                fill: "#FAFAFA",
                stroke: "#212121",
                minSize: new go.Size(120, 50)
              }),
              scope.g(go.TextBlock, {
                  margin: 5,
                  maxSize: new go.Size(200, NaN),
                  wrap: go.TextBlock.WrapFit,
                  textAlign: "center",
                  editable: true,
                  font: "bold 12pt Helvetica, Arial, sans-serif",
                  stroke: '#212121'
                },
                new go.Binding("text").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
          ));

        diagram.nodeTemplateMap.add("Comment",
          scope.g(go.Node, "Auto", nodeStyle(), {
              selectable: true,
              selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
            }, {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            scope.g(go.Shape, "File", {
              fill: "#FAFAFA",
              stroke: "#212121"
            }),
            scope.g(go.TextBlock, {
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
        diagram.linkTemplate =
          scope.g(go.Link, // the whole link panel
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
            scope.g(go.Shape, // the highlight shape, normally transparent
              {
                isPanelMain: true,
                strokeWidth: 8,
                stroke: "transparent",
                name: "HIGHLIGHT"
              }),
            scope.g(go.Shape, // the link path shape
              {
                isPanelMain: true,
                stroke: "#212121",
                strokeWidth: 2
              }),
            scope.g(go.Shape, // the arrowhead
              {
                toArrow: "standard",
                stroke: null,
                fill: "#212121"
              }),
            scope.g(go.Panel, "Auto", // the link label, normally not visible
              {
                visible: false,
                name: "LABEL",
                segmentIndex: 2,
                segmentFraction: 0.5
              },
              new go.Binding("visible", "visible").makeTwoWay(),
              scope.g(go.Shape, "RoundedRectangle", // the label shape
                {
                  fill: "#F8F8F8",
                  stroke: null
                }),
              scope.g(go.TextBlock, "Label", // the label
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
        diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;


        // initialize the Palette that is on the left side of the page
        scope.myPalette =
          scope.g(go.Palette, "erPalette", // must name or refer to the DIV HTML element
            {
              "animationManager.duration": 800, // slightly longer than default (600ms) animation
              nodeTemplateMap: diagram.nodeTemplateMap, // share the templates used by myDiagram
              model: new go.GraphLinksModel([ // specify the contents of the Palette
                {
                  category: "Attribute",
                  text: "Attribute"
                }, {
                  text: "Entity"
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
    };
    return {
      restrict: "E",
      scope: false,
      link: flowchart,
      template: '<div class="panel-body" id="erPalette" style="width: Auto; height: 500px;"></div>',

    }
  }

})();

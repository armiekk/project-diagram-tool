var $ = go.GraphObject.make;
//diagram
var diagram =
$(go.Diagram, "myDiagram",
  {
    allowDrop: true,
    "undoManager.isEnabled": true
  });
diagram.nodeTemplate =
  $(go.Node, "Spot",
    { locationSpot: go.Spot.Center },
    new go.Binding("angle").makeTwoWay(),
        // the main object is a Panel that surrounds a TextBlock with a Shape
        $(go.Panel, "Auto",
          { name: "PANEL" },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Shape, "Rectangle",  // default figure
            {
              portId: "", // the default port: if no spot on link data, use closest side
              fromLinkable: true, toLinkable: true, cursor: "pointer",
              fill: "white"  // default color
            },
            new go.Binding("figure"),
            new go.Binding("fill")),
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
  );

//palette
var palette = $(go.Palette, "leftPalette",
{
  maxSelectionCount: 1,
  nodeTemplateMap: diagram.nodeTemplateMap,
  model: new go.GraphLinksModel([  // specify the contents of the Palette
           { text: "Start", figure: "Circle", fill: "green" },
           { text: "Step" },
           { text: "DB", figure: "Database", fill: "lightgray" },
           { text: "???", figure: "Diamond", fill: "lightskyblue" },
           { text: "End", figure: "Circle", fill: "red" },
           { text: "Comment", figure: "RoundedRectangle", fill: "lightyellow" }
         ], [
           // the Palette also has a disconnected Link, which the user can drag-and-drop
           { points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
         ])
  }
);

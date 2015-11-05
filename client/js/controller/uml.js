(function() {
  'use_strict';

  angular.module('app')
    .controller("umlCtrl", ['$scope', umlCtrl]);

  function umlCtrl($scope) {
    initGojs();
    function initGojs() {
      $scope.g = go.GraphObject.make;
      //diagram
      $scope.diagram =
        $scope.g(go.Diagram, "umlDiagram", {
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
          allowDrop: true,
          "undoManager.isEnabled": true
        });
      $scope.diagram.nodeTemplate =
        $scope.g(go.Node, "Spot", {
            locationSpot: go.Spot.Center
          },
          new go.Binding("angle").makeTwoWay(),
          // the main object is a Panel that surrounds a TextBlock with a Shape
          $scope.g(go.Panel, "Auto", {
              name: "PANEL"
            },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            $scope.g(go.Shape, "Rectangle", // default figure
              {
                portId: "", // the default port: if no spot on link data, use closest side
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                fill: "white" // default color
              },
              new go.Binding("figure"),
              new go.Binding("fill")),
            $scope.g(go.TextBlock, {
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
      $scope.palette = $scope.g(go.Palette, "umlPalette", {
        maxSelectionCount: 1,
        nodeTemplateMap: $scope.diagram.nodeTemplateMap,
        model: new go.GraphLinksModel([ // specify the contents of the Palette
          {
            text: "Start",
            figure: "Circle",
            fill: "green"
          }, {
            text: "Step"
          }, {
            text: "DB",
            figure: "Database",
            fill: "lightgray"
          }, {
            text: "???",
            figure: "Diamond",
            fill: "lightskyblue"
          }, {
            text: "End",
            figure: "Circle",
            fill: "red"
          }, {
            text: "Comment",
            figure: "RoundedRectangle",
            fill: "lightyellow"
          }
        ], [
          // the Palette also has a disconnected Link, which the user can drag-and-drop
          {
            points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)])
          }
        ])
      });
    }
  }

})();

(function(){
  'use_strict';

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise("/flowChart");

      $stateProvider
        .state('flowChart', {
          url: "/flowChart",
          templateUrl: "view/flowchart.html",
          controller: "flowChartCtrl"
        })
        .state('UML', {
          url: "/UML",
          templateUrl: "view/uml.html",
          controller: "umlCtrl"
        });

    });

})();

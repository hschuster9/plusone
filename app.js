angular
  .module("superApp", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    RouterFunction
  ])
  .factory("ActivityFactory", [
  "$resource",
  ActivityFactoryFunction
  ])
  .controller("ActivityIndexController", [
  "ActivityFactory",
  ActivityIndexControllerFunction
  ])
  .controller("ActivityShowControler", [
  "ActivityFactory",
  "$stateParams",
  ActivityShowControllerFunction
  ])

  function RouterFunction($stateProvider){
    $stateProvider
      .state("activityIndex", {
        url: "",
        templateUrl: "ng-views/index.html",
        controller: "ActivityIndexController",
        controllerAs: "vm"
      })
      .state("activityShow", {
        url: "/activities/:id",
        templateUrl: "ng-views/show.html",
        controller: "ActivityShowControler",
        controllerAs: "vm"
      })
  }

  function ActivityFactoryFunction($resource){
    return  $resource("http://localhost:3000/activities/:id", {}, {
        update: {method: "PUT"}
      })
  }

  function ActivityIndexControllerFunction(ActivityFactory, $state){
    this.activities = ActivityFactory.query();

    this.activity = new ActivityFactory();
    this.create = function(){
      this.activity.$save(function(activity) {
        $state.go("activityIndex")
      })
    }
  }
  function ActivityShowControllerFunction(ActivityFactory, $stateParams){
    this.activity = ActivityFactory.get({id: $stateParams.id});

 }

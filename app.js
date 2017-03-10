angular
  .module("superApp", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    RouterFunction
  ])
  .factory(["ActivityFactory",
  "$resource",
  ActivityFactoryFunction
  ])
  .controller(["ActivityIndexController",
  "ActivityFactory",
  ActivityIndexControllerFunction
  ])

  function RouterFunction($stateProvider){
    $stateProvider
      .state("activityIndex", {
        url: "",
        templateUrl: "ng-views/index.html",
        controllerAs: "vm"
      })
  }

  function ActivityFactoryFunction($resource){
    return $resource("http://localhost:3000/activities/:id", {}, {
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

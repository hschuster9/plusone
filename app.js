"use strict"

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
  .controller("ActivityNewController", [
    "ActivityFactory",
    ActivityNewControllerFunction
  ])
  .controller("ActivityShowController", [
  "ActivityFactory",
  "$stateParams",
  ActivityShowControllerFunction
  ])
  .controller("ActivityEditController", [
    "ActivityFactory",
    "$stateParams",
    "$state",
    ActivityEditControllerFunction
  ])

  function RouterFunction($stateProvider){
    $stateProvider
      .state("activityIndex", {
        url: "",
        templateUrl: "ng-views/index.html",
        controller: "ActivityIndexController",
        controllerAs: "vm"
      })
      .state("activityNew", {
        url: "/activities/new",
        templateUrl: "ng-views/new.html",
        controller: "ActivityNewController",
        controllerAs: "vm"
      })
      .state("activityShow", {
        url: "/activities/:id",
        templateUrl: "ng-views/show.html",
        controller: "ActivityShowController",
        controllerAs: "vm"
      })
      .state("activityEdit", {
        url: "/activities/:id/edit",
        templateUrl: "ng-views/edit.html",
        controller: "ActivityEditController",
        controllerAs: "vm"
      })
  }

  function ActivityFactoryFunction($resource){
    return  $resource("http://localhost:3000/activities/:id ", {}, {
        update: {method: "PUT"}
      })
  }

  function ActivityIndexControllerFunction(ActivityFactory, $state){
    this.activities = ActivityFactory.query()
  }

  function ActivityNewControllerFunction(ActivityFactory, $state){
    this.activity = new ActivityFactory()
    this.create = function(){
      this.activity.$save(function(activity) {
        $state.go("activityIndex")
      })
    }
  }

  function ActivityShowControllerFunction(ActivityFactory, $stateParams){
    this.activity = ActivityFactory.get({id: $stateParams.id})
 }

  function ActivityEditControllerFunction( ActivityFactory, $stateParams , $state){
    this.activity = ActivityFactory.get({id: $stateParams.id})
    this.update = function(){
      this.activity.$update({id: $stateParams.id},
        function(activity) {
        $state.go("activityShow", {id: activity.id})
      })
    }
  }

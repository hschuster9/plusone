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
  .factory("PeopleFactory", function($resource){
    return $resource ("https://plusoneproject.herokuapp.com/activities/:activity_id/people/:id", {}, {
        update: {method: "PUT"},
      });
  })
  .factory("MessageFactory", function($resource){
    return $resource ("https://plusoneproject.herokuapp.com/activities/:activity_id/messages/:id", {}, {
      update: {method: "PUT"},
    });
  })
  .controller("CategoryIndexController", [
    CategoryIndexControllerFunction
  ])
  .controller("ActivityIndexController", [
    "ActivityFactory",
    "$stateParams",
    ActivityIndexControllerFunction
  ])
  .controller("ActivityNewController", [
    "ActivityFactory",
    "$state",
    ActivityNewControllerFunction
  ])
  .controller("ActivityShowController", [
    "ActivityFactory",
    "PeopleFactory",
    "MessageFactory",
    "$stateParams",
    ActivityShowControllerFunction
  ])
  .controller("ActivityEditController", [
    "ActivityFactory",
    "$stateParams",
    "$state",
    ActivityEditControllerFunction
  ])
  .controller("PersonNewController", [
    "PeopleFactory",
    "$stateParams",
    "$state",
    PersonNewControllerFunction
  ])
  .controller("PersonEditController", [
    "PeopleFactory",
    "$stateParams",
    "$state",
    PersonEditControllerFunction
  ])
  .controller("MessageNewController", [
    "MessageFactory",
    "$stateParams",
    "$state",
    MessageNewControllerFunction
  ])
  .controller("MessageEditController", [
    "MessageFactory",
    "$stateParams",
    "$state",
    MessageEditControllerFunction
  ])


  function RouterFunction($stateProvider){
    $stateProvider
      .state("categoryIndex", {
        url: "/",
        templateUrl: "ng-views/category_index.html",
        controller: "CategoryIndexController",
        controllerAs: "vm"
      })
      .state("activityIndex", {
        url: "/categories/:category",
        templateUrl: "ng-views/activity_index.html",
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
      .state("personNew", {
        url: "/activities/:activity_id/people/new",
        templateUrl: "ng-views/person_new.html",
        controller: "PersonNewController",
        controllerAs: "vm"
      })
      .state("personEdit", {
        url: "/activities/:activity_id/people/:id/edit",
        templateUrl: "ng-views/person_edit.html",
        controller: "PersonEditController",
        controllerAs: "vm"
      })
      .state("messageNew", {
        url: "/activities/:activity_id/messages/new",
        templateUrl: "ng-views/message_new.html",
        controller: "MessageNewController",
        controllerAs: "vm"
      })
      .state("messageEdit", {
        url: "/activities/:activity_id/messages/:id/edit",
        templateUrl: "ng-views/message_edit.html",
        controller: "MessageEditController",
        controllerAs: "vm"
      })
  }

  function ActivityFactoryFunction($resource){
    return  $resource("https://plusoneproject.herokuapp.com/activities/:id", {}, {
        update: {method: "PUT"},
      });
  }

  function CategoryIndexControllerFunction(){
  }

  function ActivityIndexControllerFunction(ActivityFactory, $stateParams, $state){
    this.activities = ActivityFactory.query()
    this.category = $stateParams.category
  }

  function ActivityNewControllerFunction(ActivityFactory, $state){
    this.activity = new ActivityFactory()
    this.create = function(){
      this.activity.$save(function(activity) {
        $state.go("activityShow", {id: activity.id});
      });
    };
  }

  function ActivityShowControllerFunction(ActivityFactory, PeopleFactory, MessageFactory, $stateParams){
    this.activity = ActivityFactory.get({id: $stateParams.id})
    this.people = PeopleFactory.query({activity_id: $stateParams.id})
    this.messages = MessageFactory.query({activity_id: $stateParams.id})
 }

  function ActivityEditControllerFunction( ActivityFactory, $stateParams , $state){
    this.activity = ActivityFactory.get({id: $stateParams.id})
    this.update = function(){
      this.activity.$update({id: $stateParams.id},
        function(activity) {
        $state.go("activityShow", {id: activity.id});
      });
    }
    this.destroy = function(){
      this.activity.$delete({id: $stateParams.id}, function(activity){
        $state.go("categoryIndex")
      });
    }
  }

function PersonNewControllerFunction(PeopleFactory, $stateParams, $state) {
  this.person = new PeopleFactory()
  this.create = function(){
    this.person.activity_id = $stateParams.activity_id
    this.person.$save({activity_id: $stateParams.activity_id},
      function(activity) {
      $state.go("activityShow", {id: $stateParams.activity_id})
    });
  };
}

function PersonEditControllerFunction( PeopleFactory, $stateParams, $state) {
  this.person = PeopleFactory.get({activity_id: $stateParams.activity_id, id: $stateParams.id})
  this.update = function(){
    this.person.$update({activity_id: $stateParams.activity_id, id: $stateParams.id},
      function(person) {
      $state.go("activityShow", {id: person.activity_id})
    });
  }
  this.destroy = function(){
    this.person.$delete({activity_id: $stateParams.activity_id, id: $stateParams.id}, function(person){
      $state.go("activityShow", {id: $stateParams.activity_id})
    });
  }
}

function MessageNewControllerFunction(MessageFactory, $stateParams, $state) {
  this.message =  new MessageFactory()
  this.create = function(){
    this.message.activity_id = $stateParams.activity_id
    this.message.$save({activity_id: $stateParams.activity_id},
    function(activity) {
      $state.go("activityShow", {id: $stateParams.activity_id})
    });
  }
}

function MessageNewControllerFunction( MessageFactory, $stateParams, $state) {
  this.message =  new MessageFactory()
  this.create = function(){
    this.message.activity_id = $stateParams.activity_id
    this.message.$save({activity_id: $stateParams.activity_id},
    function(activity) {
      $state.go("activityShow", {id: $stateParams.activity_id})
    })
  }
}

function MessageEditControllerFunction( MessageFactory, $stateParams, $state){
  this.message = MessageFactory.get({activity_id: $stateParams.activity_id, id: $stateParams.id})
  this.update = function(){
    this.message.$update({activity_id: $stateParams.activity_id, id: $stateParams.id},
      function(message){
        $state.go("activityShow", {id: message.activity_id})
      })
  }
  this.destroy = function(){
    this.message.$delete({activity_id: $stateParams.activity_id, id: $stateParams.id},
    function(message){
      $state.go("activityShow", {id: $stateParams.activity_id})
    })
  }
}

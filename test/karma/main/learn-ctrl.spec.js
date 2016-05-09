'use strict';

describe('module: main, controller: LearnCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var LearnCtrl;
  beforeEach(inject(function ($controller) {
    LearnCtrl = $controller('LearnCtrl');
  }));

  it('should do something', function () {
    expect(!!LearnCtrl).toBe(true);
  });

});

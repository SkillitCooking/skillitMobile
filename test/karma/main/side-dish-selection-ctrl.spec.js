'use strict';

describe('module: main, controller: SideDishSelectionCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SideDishSelectionCtrl;
  beforeEach(inject(function ($controller) {
    SideDishSelectionCtrl = $controller('SideDishSelectionCtrl');
  }));

  it('should do something', function () {
    expect(!!SideDishSelectionCtrl).toBe(true);
  });

});

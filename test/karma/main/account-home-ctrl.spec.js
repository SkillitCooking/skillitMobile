'use strict';

describe('module: main, controller: AccountHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var AccountHomeCtrl;
  beforeEach(inject(function ($controller) {
    AccountHomeCtrl = $controller('AccountHomeCtrl');
  }));

  it('should do something', function () {
    expect(!!AccountHomeCtrl).toBe(true);
  });

});

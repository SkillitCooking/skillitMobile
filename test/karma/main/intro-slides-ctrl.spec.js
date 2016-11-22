'use strict';

describe('module: main, controller: IntroSlidesCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var IntroSlidesCtrl;
  beforeEach(inject(function ($controller) {
    IntroSlidesCtrl = $controller('IntroSlidesCtrl');
  }));

  it('should do something', function () {
    expect(!!IntroSlidesCtrl).toBe(true);
  });

});

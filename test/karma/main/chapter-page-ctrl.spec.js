'use strict';

describe('module: main, controller: ChapterPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ChapterPageCtrl;
  beforeEach(inject(function ($controller) {
    ChapterPageCtrl = $controller('ChapterPageCtrl');
  }));

  it('should do something', function () {
    expect(!!ChapterPageCtrl).toBe(true);
  });

});

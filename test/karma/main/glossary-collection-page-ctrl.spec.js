'use strict';

describe('module: main, controller: GlossaryCollectionPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var GlossaryCollectionPageCtrl;
  beforeEach(inject(function ($controller) {
    GlossaryCollectionPageCtrl = $controller('GlossaryCollectionPageCtrl');
  }));

  it('should do something', function () {
    expect(!!GlossaryCollectionPageCtrl).toBe(true);
  });

});

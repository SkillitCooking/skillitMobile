'use strict';

describe('module: main, controller: TrainingVideoCollectionPageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var TrainingVideoCollectionPageCtrl;
  beforeEach(inject(function ($controller) {
    TrainingVideoCollectionPageCtrl = $controller('TrainingVideoCollectionPageCtrl');
  }));

  it('should do something', function () {
    expect(!!TrainingVideoCollectionPageCtrl).toBe(true);
  });

});

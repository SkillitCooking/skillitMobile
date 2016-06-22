'use strict';

describe('module: main, controller: EditByoIngredientsCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var EditByoIngredientsCtrl;
  beforeEach(inject(function ($controller) {
    EditByoIngredientsCtrl = $controller('EditByoIngredientsCtrl');
  }));

  it('should do something', function () {
    expect(!!EditByoIngredientsCtrl).toBe(true);
  });

});

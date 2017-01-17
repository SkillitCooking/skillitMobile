'use strict';

describe('Directive: breakEggStepInput', function () {

  // load the directive's module
  beforeEach(module('skillitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<break-egg-step-input></break-egg-step-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the breakEggStepInput directive');
  }));
});

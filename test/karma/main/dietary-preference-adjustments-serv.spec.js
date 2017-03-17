'use strict';

describe('module: main, service: DietaryPreferenceAdjustments', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var DietaryPreferenceAdjustments;
  beforeEach(inject(function (_DietaryPreferenceAdjustments_) {
    DietaryPreferenceAdjustments = _DietaryPreferenceAdjustments_;
  }));

  it('should do something', function () {
    expect(!!DietaryPreferenceAdjustments).toBe(true);
  });

});

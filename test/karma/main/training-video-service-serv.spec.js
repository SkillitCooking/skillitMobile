'use strict';

describe('module: main, service: TrainingVideoService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var TrainingVideoService;
  beforeEach(inject(function (_TrainingVideoService_) {
    TrainingVideoService = _TrainingVideoService_;
  }));

  it('should do something', function () {
    expect(!!TrainingVideoService).toBe(true);
  });

});

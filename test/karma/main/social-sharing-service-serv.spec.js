'use strict';

describe('module: main, service: SocialSharingService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var SocialSharingService;
  beforeEach(inject(function (_SocialSharingService_) {
    SocialSharingService = _SocialSharingService_;
  }));

  it('should do something', function () {
    expect(!!SocialSharingService).toBe(true);
  });

});

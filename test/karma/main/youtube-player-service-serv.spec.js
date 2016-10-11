'use strict';

describe('module: main, service: YoutubePlayerService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var YoutubePlayerService;
  beforeEach(inject(function (_YoutubePlayerService_) {
    YoutubePlayerService = _YoutubePlayerService_;
  }));

  it('should do something', function () {
    expect(!!YoutubePlayerService).toBe(true);
  });

});

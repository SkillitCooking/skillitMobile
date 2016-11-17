'use strict';

describe('module: main, service: FavoriteRecipeDetectionService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var FavoriteRecipeDetectionService;
  beforeEach(inject(function (_FavoriteRecipeDetectionService_) {
    FavoriteRecipeDetectionService = _FavoriteRecipeDetectionService_;
  }));

  it('should do something', function () {
    expect(!!FavoriteRecipeDetectionService).toBe(true);
  });

});

'use strict';

describe('module: main, controller: ArticlePageCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ArticlePageCtrl;
  beforeEach(inject(function ($controller) {
    ArticlePageCtrl = $controller('ArticlePageCtrl');
  }));

  it('should do something', function () {
    expect(!!ArticlePageCtrl).toBe(true);
  });

});

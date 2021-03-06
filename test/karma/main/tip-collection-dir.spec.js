'use strict';

describe('module: main, directive: tipCollection', function () {

  // load the directive's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  var element,
    $rootScope;

  beforeEach(inject(function (_$rootScope_) {
    $rootScope = _$rootScope_.$new();
  }));

  it('should show text', inject(function ($compile) {
    element = angular.element('<tip-collection></tip-collection>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the tipCollection directive');
  }));
});

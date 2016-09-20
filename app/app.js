'use strict';

var __env = {};

if (window) {
  Object.assign(__env, window.__env);
}
angular.module('Skillit', [
  // load your modules here
  'main', // starting with the main module
])
.constant('__env', __env);

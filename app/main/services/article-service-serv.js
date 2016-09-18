'use strict';
angular.module('main')
.factory('ArticleService', function (Restangular) {

  var baseArticles = Restangular.all('articles');

  return {
    getArticleFromId: function(articleId) {
      return baseArticles.get(articleId);
    }
  };

});

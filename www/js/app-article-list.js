angular.module('articlelist', [])
.controller('articleListController', ['$scope', '$rootScope', '$state', 'articleListService', 'utilService', 

function($scope, $rootScope, $state, articleListService, utilService) {

	$scope.articles = [
		{"id":1},
		{"id":2},
		{"id":3},
		{"id":4},
		{"id":5},
		{"id":6},
		{"id":7},
		{"id":8},
		{"id":9},
		{"id":10}
	];
	$scope.numComments;

	$scope.getArticles = function() {

		// see which articles have been liked
		var cookies = document.cookie.split(';');
		for(var i=0; i < cookies.length; i++) {
			var int1 = cookies[i].split('=');
			var key = int1[0];
			var value = parseInt(int1[1]);

			for(var j = 0; j < $scope.articles.length; j++) {
				if(j === value) {
					$scope.articles[j]['thumbsUp'] = true;
				}
			}
		}		

		return;
	};
	$scope.getArticles();

	$scope.getNumComments = function() {
		articleListService.getComments()
			.success(function(response) {
				$scope.numComments = response.length;
				console.log($scope.numComments);
			})
			.error(function(response) {
				console.log("Could not get the number of comments. Are you connected to the backend server?");
				$scope.numComments = 4;
			});
	};
	$scope.getNumComments();

	function isEmpty(obj) {
	    return Object.keys(obj).length === 0;
	}

	$scope.toggleLikeArticle = function(article, index) {

		if(article.hasOwnProperty('thumbsUp')) {
			$scope.unlikeArticle(article.id, index);
		}
		else {
			$scope.likeArticle(article.id, index);
		}
	};

	$scope.likeArticle = function(id, index) {

		var currentArticleCookie = utilService.readCookie('article' + id);

		utilService.likeArticle(id, index);
		$scope.articles[index]['thumbsUp'] = true;
		$scope.getArticles();
	};

	$scope.unlikeArticle = function(articleID, index) {
		
		utilService.unlikeArticle(articleID);
		delete $scope.articles[index]['thumbsUp'];

		$scope.getArticles();
	};

	$scope.scrollToCustomPos = function(position) {

        var pos = position;
	    var duration = 2000; //milliseconds

	    //Scroll to the exact position
	    $document.scrollTop(pos, duration);
	};

	$scope.stripeFileName = function(filePath) {
		var splitStr = filePath.split(/[\\\/]/);
		var fileName = splitStr.slice(-1)[0];
		var fileNameNoExt = fileName.split(/[.]/);
		return fileNameNoExt[0];
	};
}])
;
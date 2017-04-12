angular.module('articlelist', [])
.controller('articleListController', ['$scope', '$rootScope', '$state', 'articleListService', 'utilService', 

function($scope, $rootScope, $state, articleListService, utilService) {

	$scope.articles = [
		// {"id":1},
		// {"id":2},
		// {"id":3},
		// {"id":4},
		// {"id":5},
		// {"id":6},
		// {"id":7},
		// {"id":8},
		// {"id":9},
		// {"id":10}
	];
	$scope.numComments;

	$scope.getArticles = function() {
        articleListService.getAllArticles()
            .then(function (response) {
                $scope.articles = response;

                // get which articles have been liked

                for(var i = 0; i < $scope.articles.length; i++) {
                    var storagteItemName = "article" + $scope.articles[i].id;
                    if(localStorage.getItem(storagteItemName) !== null) {
                        $scope.articles[i].thumbsUp = true;
                    }
                }
            });

	};
	$scope.getArticles();

	$scope.getNumComments = function() {
		articleListService.getComments()
			.then(function(response) {
				$scope.$apply(function () {
                    $scope.numComments = response.length;
                });

			})
			.catch(function(response) {
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
        utilService.likeArticle(id)
            .then(function () {
                $scope.$apply(function () {
                    $scope.articles[index]['thumbsUp'] = true;
                });
            });
	};

	$scope.unlikeArticle = function(articleID, index) {

        utilService.unlikeArticle(articleID)
            .then(function () {
                $scope.$apply(function () {
                    delete $scope.articles[index]['thumbsUp'];
                });
            });

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
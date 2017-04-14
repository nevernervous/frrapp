angular.module('articledetails', [])
.controller('articleDetailsController', ['$scope', '$rootScope', '$state', '$timeout', '$location','articleListService', 'utilService',
function($scope, $rootScope, $state, $timeout, $location, articleListService, utilService) {

	$scope.MAX_COMMENT_WORDS_COUNT= 120;
	$scope.commentWordsCount = 0;
	$scope.fontSize = 18;
	$scope.article = {
		id: $location.search().id
	};

	if (localStorage.getItem("article" + $scope.article.id) !== null) {
		$scope.article.thumbsUp = true;
	}

	$scope.incrementFont = function() {
		$scope.fontSize += 1;
	};
	$scope.decrementFont = function() {
		$scope.fontSize -= 1;
	};

	$scope.getArticle = function() {
		$scope.article = articleListService.getAllArticles();
	};
	$scope.getArticle();

	$scope.convertToReadableDate = function(dateStr) {
		return utilService.convertToReadableDate(dateStr);
	};

	$scope.toggleLikeArticle = function(article) {
		if(article.hasOwnProperty('thumbsUp')) {
			$scope.unlikeArticle(article.id);
		}
		else {
			$scope.likeArticle(article.id);
		}
	};

	$scope.likeArticle = function(articleID) {
		utilService.likeArticle(articleID)
            .then(function () {
            	$scope.$apply(function () {
                    $scope.article['thumbsUp'] = true;
                });
            });
	};

	$scope.unlikeArticle = function(articleID) {
        utilService.unlikeArticle(articleID)
			.then(function () {
                $scope.$apply(function () {
                    delete $scope.article['thumbsUp'];
                });
            });
	};

	$scope.convertToReadableDate = function(dateStr) {
		return utilService.convertToReadableDate(dateStr);
	}


	/************** COMMENTS *****************/
	$scope.newComment = {};
	$scope.newComment.comment = "";
	$scope.uploading = false;
	$scope.already_loaded = false;
	$scope.numComments = 0;

	$scope.showComments = function() {
		$scope.showing = true;
		$scope.getComments();
	};

	$scope.hideComments = function() {
		$scope.showing = false;
	};

	function isEmpty(obj) {
	    return Object.keys(obj).length === 0;
	}

	$scope.getNumComments = function() {
		articleListService.getComments()
			.then(function(response) {
                $scope.$apply(function () {
                    $scope.numComments = response.length;
                });
			})
			.catch(function(response) {
				console.log("Could not get the number of comments. Are you connected to the backend server?");
			});
	};
	$scope.getNumComments();

	$scope.getComments = function(force) {

		if($scope.already_loaded && !force)
			return;

		$scope.showing = true;

		$timeout(function() {
			$scope.showing = false;
			articleListService.getComments()
				.then(function(response){
					$scope.$apply(function () {
                        $scope.comments = response;
                        $scope.status_hide = true;

                        for(var i = 0 ; i < $scope.comments.length; i++) {

                            // if comment is empty, remove it
                            if(isEmpty($scope.comments[i])) {
                                $scope.comments.splice(i, 1);
                            }

                            $scope.comments[i]['date'] = new Date($scope.comments[i]['date']);
                        }
                    });

				}).catch(function(response) {
					console.log(response);
					
					$scope.alert = { type: 'danger', 
						msg: 'Uh oh, something went wrong when loading the comments!' };
				});
		}, 2000);

		$scope.already_loaded = true;
	};

	$scope.uploadNewComment = function() {

		$scope.uploading = true;

		function getMinutes(minStr) {
			if($scope.newComment.date.getMinutes() < 10) {
				return '0' + $scope.newComment.date.getMinutes();
			} else {
				return $scope.newComment.date.getMinutes();
			}
		}

		$scope.newComment.date = new Date();
		$scope.newComment.time = $scope.newComment.date.getHours() + ':' +
					getMinutes();

		articleListService.uploadComment($scope.newComment)
			.then(function(response) {
				$scope.getComments(true);
				$scope.uploading = false;
				$scope.getNumComments();
			}).catch(function(response) {
				console.log(response);
				$scope.uploading = false;
			});
	};

    $scope.checkComment = function () {
    	var wordsArray = $scope.newComment.comment.split(/\s+/);
        var wordsCount = wordsArray.length;
        if(wordsCount > $scope.MAX_COMMENT_WORDS_COUNT) {
			wordsArray.splice(120, wordsCount - $scope.MAX_COMMENT_WORDS_COUNT);
			$scope.newComment.comment = wordsArray.join(" ");
		}
        $scope.commentWordsCount = $scope.newComment.comment.split(/\s+/).length;
    }

	/************* SCROLL TO TOP *****************/
	$scope.scrollToCustomPos = function(position) {

        var pos = position;
	    var duration = 2000; //milliseconds

	    //Scroll to the exact position
	    $document.scrollTop(pos, duration);
	};
}]).filter('articleDate', function ($filter) {
	return function (dateString) {
		var date = new Date(dateString);
		var today = new Date();
		var diff = Math.floor((today - date) / 1000);
        var result = $filter('date')(date, "EEEE MMM dd, yyyy, h:mm a");
        if(diff < 0) {
        	result = $filter('date')(today, "EEEE MMM dd, yyyy, h:mm a");
		}else if(diff < 60) {
			result = diff + 'seconds ago';
		}else if(diff < 3600) {
			result = Math.floor(diff / 60) + ' minutes ago';
		}else if (diff < 3600 * 24) {
            result = Math.floor(diff / 3600) + ' hours ago';
		}else if (diff < 3600 * 24 * 2) {
			var yesterday = today;
			yesterday.setDate(yesterday.getDate() - 1);
			if (date.getDate() == yesterday.getDate())
				result = 'Yesterday' + $filter('date')(date, "h:mm a");
		}
		return result;
    }
});
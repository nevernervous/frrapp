angular.module('articledetails', [])
.controller('articleDetailsController', ['$scope', '$rootScope', '$state', '$timeout', 'articleListService', 'utilService',
function($scope, $rootScope, $state, $timeout, articleListService, utilService) {

	$scope.wordsLeft = 120;
	$scope.fontSize = 18;
	$scope.article = {
		id: 9999
	}

	$scope.incrementFont = function() {
		$scope.fontSize += 1;
	};
	$scope.decrementFont = function() {
		$scope.fontSize -= 1;
	};

	$scope.getArticle = function() {
		//$scope.article = articleListService.getActiveArticle();
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
		$scope.article['thumbsUp'] = true;
	};

	$scope.unlikeArticle = function(articleID) {
		delete $scope.article['thumbsUp'];
	};

	$scope.convertToReadableDate = function(dateStr) {
		return utilService.convertToReadableDate(dateStr);
	}


	/************** COMMENTS *****************/
	$scope.newComment = {};
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
			.success(function(response) {
				$scope.numComments = response.length;
			})
			.error(function(response) {
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
				.success(function(response){

					$scope.comments = response;
					$scope.status_hide = true;

					for(var i = 0 ; i < $scope.comments.length; i++) {

						// if comment is empty, remove it
						if(isEmpty($scope.comments[i])) {
							$scope.comments.splice(i, 1);
						}

						$scope.comments[i]['date'] = new Date($scope.comments[i]['date']);
					}
				}).error(function(response) {
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
			.success(function(response) {
				$scope.getComments(true);
				$scope.uploading = false;
				$scope.getNumComments();
			}).error(function(response) {
				console.log(response);
				$scope.uploading = false;
			});
	};

	$scope.checkWordLen = function(len) {
		var wordLen = 120,
		len; // Maximum word length
	
		len = $('#comment_body').val().split(/[\s]+/);
		if (len.length > wordLen) { 
			if ( event.keyCode == 46 || event.keyCode == 8 ) { // Allow backspace and delete buttons
		    } else if (event.keyCode < 48 || event.keyCode > 57 ) { //all other buttons
		    	event.preventDefault();
		    }
		}

		$scope.wordsLeft = (wordLen) - len.length;
		$('.words-left').html($scope.wordsLeft+ ' words left');
		if($scope.wordsLeft == 0) {
			$('.words-left').css({
				'background':'red'
			}).prepend('<i class="fa fa-exclamation-triangle"></i>');
		}
	};

	/************* SCROLL TO TOP *****************/
	$scope.scrollToCustomPos = function(position) {

        var pos = position;
	    var duration = 2000; //milliseconds

	    //Scroll to the exact position
	    $document.scrollTop(pos, duration);
	};
}]);
/**
	app.js the angular app code, it has code to handle routing. 
	Also little bit of code to set the page title and to dynamically load scripts for views.
**/

(function() {
	var app = angular.module('app', ['ui.router', 'nav', 'articlelist', 'articledetails', 'accountDetails', 'angular-inview', 'ngAnimate', 'ui.bootstrap', 'duScroll'])

	// define for requirejs loaded modules
	define('app', [], function() { return app; });

	// function for dynamic load with requirejs of a javascript module for use with a view
	// in the state definition call add property `resolve: req('/views/ui.js')`
	// or `resolve: req(['/views/ui.js'])`
	// or `resolve: req('views/ui')`
	function req(deps) {
		if (typeof deps === 'string') deps = [deps];
		return {
			deps: function ($q, $rootScope) {
				var deferred = $q.defer();
				require(deps, function() {
					$rootScope.$apply(function () {
						deferred.resolve();
					});
					deferred.resolve();
				});
				return deferred.promise;
			}
		}
	}

	app.config(function($stateProvider, $urlRouterProvider, $controllerProvider){
		var origController = app.controller;
		app.controller = function (name, constructor, $rootScope){
			$controllerProvider.register(name, constructor);
			return origController.apply(this, arguments);
		}
	})
	.directive('updateTitle', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				link: function(scope, element) {
					var listener = function(event, toState) {
						var title = 'PubApp';
						if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' - ' + title;
						$timeout(function() {
							element.text(title);
						}, 0, false);
					};

					$rootScope.$on('$stateChangeSuccess', listener);
				}
			};
		}
	])
	.controller('appController', function ($scope, $rootScope, $document) {

        $rootScope.SITE_TITLE = "PUBAPP";
        $rootScope.SITE_TITLE_FIRST = "Pub";
        $rootScope.SITE_TITLE_SECOND = "App";
        $scope.maxArticleList = 10;

        $scope.getArticleNum = function() {
        	return new Array($scope.maxArticleList); 
        }

        $rootScope.YEAR = "2017";

        $rootScope.backEndUrl = "http://localhost:8888/";

        $scope.scrollToCustomPos = function(position) {
	        var pos = position;
		    var duration = 2000; //milliseconds


		    //Scroll to the exact position
		    $document.scrollTop(pos, duration);
		};

		$rootScope.$on('$stateChangeSuccess', function() {
		   document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	})
	.service('articleListService', ['$http', '$rootScope', function($http, $rootScope) {


		function getAllArticles() {
	    	return new Promise(function (resolve, reject) {
                $http.get("http://localhost:8888/api/articles", {})
                    .success(function (response) {
						resolve(response);

                    }).error(function (response) {
                    	reject(response);
                });
            });

	    }

	    function getComments() {
            return new Promise(function (resolve, reject) {
                return $http.get("http://localhost:8888/api/comments", {})
                    .success(function (response) {
                        resolve(response);
                    }).error(function (response) {
                    	reject(response);
                	});
            });
	    }

	    function uploadComment(comment) {
            return new Promise(function (resolve, reject) {
                return $http.post("http://localhost:8888/api/comments", comment, {})
                    .success(function (response) {
                        resolve(response);
                    }).error(function (response) {
                        reject(response);
                    });
            });
	    }

	    return {
	    	getAllArticles: getAllArticles,
	    	getComments: getComments,
	    	uploadComment: uploadComment
	    }
	}])
	.service('utilService', ['$http', '$rootScope', function($http, $rootScope) {
	    
	    var days = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday'
		};
	
	    function convertToReadableDate(dateStr) {
			var date = new Date(dateStr);
			var date2 = date.toDateString().split(' ');
			var readable = days[date.getDay()] + ' ' + date2[1] + ' ' + date2[2] + ', ' + date2[3];
			return readable;
		};

		function isEmpty(obj) {
		    return Object.keys(obj).length === 0;
		}

		// function createCookie(name,value,days) {
		// 	if (days) {
		// 		var date = new Date();
		// 		date.setTime(date.getTime()+(days*24*60*60*1000));
		// 		var expires = "; expires="+date.toGMTString();
		// 	}
		// 	else var expires = "";
		// 	document.cookie = name+"="+value+expires+"; path=/";
		// }
        //
		// function readCookie(name) {
		// 	var nameEQ = name + "=";
		// 	var ca = document.cookie.split(';');
		// 	for(var i=0;i < ca.length;i++) {
		// 		var c = ca[i];
		// 		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		// 		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		// 	}
		// 	return null;
		// }
        //
		// function eraseCookie(name) {
		// 	createCookie(name,"",-1);
		// }


		function likeArticle(id) {
			return new Promise(function (resolve, reject) {
				try {
                    var name = "article" + id;
                    localStorage.setItem(name, id);
                    resolve();
				}catch (err) {
					reject(err);
				}
            });
		};

		function unlikeArticle(id) {
            return new Promise(function (resolve, reject) {
            	try{
					localStorage.removeItem("article" + id);
					resolve();
                }catch(err) {
            		reject(err);
				}
            });
		};

	    return {
	    	convertToReadableDate: convertToReadableDate,
	    	likeArticle: likeArticle,
	    	unlikeArticle: unlikeArticle,
	    	// createCookie: createCookie,
	    	// readCookie: readCookie,
	    	// eraseCookie: eraseCookie
	    }
	}])
	app.directive("scroll", function ($window) {
	    return function(scope, element, attrs) {
	        angular.element($window).bind("scroll", function() {
	            scope.visible = false;
	            scope.$apply();
	        });
	    };
	})
	
;}());


/***********************************
	HIDE NAV BAR WHEN SCROLL DOWN
***********************************/
$(document).ready(function() {
  
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 106) {
      $('#themesBar').addClass('navbar-fixed-top');
    }
    if ($(window).scrollTop() < 106) {
      $('#themesBar').removeClass('navbar-fixed-top');
    }
  });
});

/***********************************
	    SCROLL TO TOP BUTTON
***********************************/
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});


/***********************************
        SEARCH BUTTON
***********************************/
;( function( window ) {
	
	function UISearch( el, options ) {	
		this.el = el;
		this.inputEl = el.querySelector( 'form > input.sb-search-input' );
		this._initEvents();
	}

	UISearch.prototype = {
		_initEvents : function() {
			var self = this,
				initSearchFn = function( ev ) {
					if( !classie.has( self.el, 'sb-search-open' ) ) { // open it
						ev.preventDefault();
						self.open();
					}
					else if( classie.has( self.el, 'sb-search-open' ) && /^\s*$/.test( self.inputEl.value ) ) { // close it
						self.close();
					}
				}

			this.el.addEventListener( 'click', initSearchFn );
			this.inputEl.addEventListener( 'click', function( ev ) { ev.stopPropagation(); });
		},
		open : function() {
			classie.add( this.el, 'sb-search-open' );
		},
		close : function() {
			classie.remove( this.el, 'sb-search-open' );
		}
	}

	// add to global namespace
	window.UISearch = UISearch;

} )( window );

document.onload = function()
{

	function msieversion() {

	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");

	    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
	    {
	        alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
	    }
	    else  // If another browser, return 0
	    {
	        alert('otherbrowser');
	    }

	    return false;
	}

	if(msieversion()) {
		$('#searchInput').css('min-width', '200px');
		$('#searchInput').css('width', '200px');
		$('#searchInput').css('max-width', '200px');
	}
}
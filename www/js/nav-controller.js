/**
	nav-controller.js the navigation controller, 
	it controls what pages are shown in the navigation menu.
**/

angular.module('nav', [])
	.controller('navController', function($scope, $state) {

		// returns true if the current router url matches the passed in url
		// so views can set 'active' on links easily
		$scope.isUrl = function(url) {
			if (url === '#') return false;
			return ('#' + $state.$current.url.source + '/').indexOf(url + '/') === 0;
		};

		$scope.themesList = [
			{
				name: 'Maecenas' ,
				url: '#/'
			},
			{
				name: 'Aenean',
				url: '#/'
			},
			{
				name: 'Donec',
				url: '#/'
			},
			{
				name: 'Vivamus',
				url: '#/'
			},
			{
				name: 'Mauris',
				url: '#/'
			},
			{
				name: 'Fusce',
				url: '#/'
			},
			{
				name: 'Aliquam',
				url: '#/'
			},
			{
				name: 'Praesent',
				url: '#/'
			},
			{
				name: 'Nullam',
				url: '#/'
			},
		];

		$scope.pages = [
			{
				name: 'Home',
				url: '#/'
			},
			{
				name: 'About',
				url: '#/about'
			},
			{
				name: 'Sign up',
				url: '#/register'
			},
			{
				name: 'Login',
				url: '#/login'
			}
		];
	});

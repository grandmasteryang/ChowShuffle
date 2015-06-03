var chowAppModule = angular.module('chowApp', ['ngRoute', 'routeStyles']);

chowAppModule.config(function($routeProvider){
	$routeProvider.
		when('/', 
            {templateUrl:'partials/home.html', css: 'partials/home.css', controller: homeControl}).
		when('/select', 
            {templateUrl:'partials/select.html', css: 'partials/select.css', controller: selectControl}).
		when('/result', 
            {templateUrl:'partials/result.html', css: 'partials/result.css', controller: resultControl}).
		otherwise({redirectTo: '/'});
});


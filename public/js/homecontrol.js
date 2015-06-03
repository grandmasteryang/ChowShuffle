var chowAppModule = angular.module('chowApp', ['ngRoute', 'routeStyles']);

var homeControl = function($scope) {

function initialize() {
	var input = document.getElementById('searchBar');
	var autocomplete = new google.maps.places.Autocomplete(input);

    $("#myForm").submit(function() {
        Place=autocomplete.getPlace();
        location.href='#/select';
    });

}

google.maps.event.addDomListener(window, 'load', initialize);
};

chowAppModule.controller("homeControl", homeControl);
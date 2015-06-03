var Place;
var Restaurant;
var Distance;

var homeControl = function($scope) {
    $scope.contact = "Contact Me";
    $scope.contactClick = function() {
        $scope.contact = "gmyangdesigns@gmail.com"
    }
    $scope.mapClick = function() {
        if (!navigator.geolocation){
           alert("Geolocation is not supported by your browser");
        }

        function success(position) {
            Place = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            location.href='#/select';
        }

        function error() {
            alert("Error, please enter your location manually");
        }

        navigator.geolocation.getCurrentPosition(success, error);
    };

    $scope.inputClick = function() {
        var input = document.getElementById('searchBar');
        var autocomplete = new google.maps.places.Autocomplete(input);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            Place=autocomplete.getPlace().geometry.location;
            location.href='#/select';
        });
    };
};

var selectControl = function($rootScope, $scope, $http) {
    Restaurant="food";
    Distance=8046.72;

    $("#fForm").submit(function(){
        $("#distance").focus();
    });

    $("#dForm").submit(function(){
        $scope.shuffleClick();
    });

    $scope.shuffleClick = function() {

        if ($("#food").val()) {
            Restaurant = $("#food").val();
        }
        if ($("#distance").val()) {
            Distance = $("#distance").val()*(1609.344);
        }

        var map = new google.maps.Map(document.getElementById('map-canvas'));

        var request = {
            location: Place,
            radius: Distance,
            keyword: Restaurant,
            types: ['restaurant', 'food']
        };

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $rootScope.user = results;
                location.href='#/result';
            }
        }

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }
};

var resultControl = function($rootScope, $scope, $http) {
    $scope.count = Math.floor(Math.random() * ($scope.user.length-1));
    $scope.contact = "gmyangdesigns@gmail.com";

    var image = "../images/burger.png";

    var map = new google.maps.Map(document.getElementById('map-canvas'));

    var request = {
        placeId: $scope.user[$scope.count].place_id
    };

    var service = new google.maps.places.PlacesService(map);

    service.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            $scope.details = place;
            if ($scope.details.website) {
                $('.name').attr('href', $scope.details.website);
            }
            else {
                $('.name').attr('href', $scope.details.url);
            } 
        }
    });

    var marker = new google.maps.Marker({
        position: { lat: Place.lat(), lng: Place.lng()},
        map: map
    });

    var destMarker = new google.maps.Marker({
        position: { lat: $scope.user[$scope.count].geometry.location.lat(), lng: $scope.user[$scope.count].geometry.location.lng()},
        map: map,
        icon: image,
        animation: google.maps.Animation.DROP
    });

    var markerList = new Array(marker.position, destMarker.position);
    var bounds = new google.maps.LatLngBounds();

    for (var i=0, LtLgLen = markerList.length; i<LtLgLen; i++) {
        bounds.extend(markerList[i]);
    }

    map.fitBounds(bounds);
    google.maps.event.trigger(map,'resize');

    google.maps.event.addListenerOnce(map, 'idle', function() {
        google.maps.event.trigger(map, 'resize');
        map.fitBounds(bounds);
    });

    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var directionsService = new google.maps.DirectionsService();

    function calcRoute() {
      var request = {
          origin:marker.position,
          destination:destMarker.position,
          travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    }

    calcRoute();
    directionsDisplay.setMap(map);

    if ($scope.user[$scope.count].price_level) {
        $scope.money = Array($scope.user[$scope.count].price_level+1).join("$");
    }
    else {
        $scope.money = "Unavailable";
    }
    
    if ($scope.user[$scope.count].rating) {
        $scope.rating = $scope.user[$scope.count].rating + "/5";
    }
    else {
        $scope.rating = "Unavailable";
    }

    $scope.reShuffleClick = function() {
        directionsDisplay.setMap(null);
        if ($scope.count < $scope.user.length-1) {
            $scope.count++;
        }
        else {
            $scope.count = 0;
        }
        
        if ($scope.user[$scope.count].price_level) {
            $scope.money = Array($scope.user[$scope.count].price_level+1).join("$");
        }
        else {
            $scope.money = "Unavailable";
        }
        
        if ($scope.user[$scope.count].rating) {
            $scope.rating = $scope.user[$scope.count].rating + "/5";
        }
        else {
            $scope.rating = "Unavailable";
        }
        destMarker.setMap(null);

        var newMarker = new google.maps.Marker({
            position: { lat: $scope.user[$scope.count].geometry.location.lat(), lng: $scope.user[$scope.count].geometry.location.lng()},
            map: map,
            icon: image,
            animation: google.maps.Animation.DROP
        });

        destMarker = newMarker;

        var markerList = new Array(marker.position, destMarker.position);
        var bounds = new google.maps.LatLngBounds();
        for (var i=0, LtLgLen = markerList.length; i<LtLgLen; i++) {
            bounds.extend(markerList[i]);
        }
        map.fitBounds(bounds);
        google.maps.event.trigger(map,'resize');

        function calcRoute() {
          var request = {
              origin:marker.position,
              destination:destMarker.position,
              travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            }
          });
        }

        calcRoute();
        directionsDisplay.setMap(map);

        var request = {
            placeId: $scope.user[$scope.count].place_id
        };

        var service = new google.maps.places.PlacesService(map);

        service.getDetails(request, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $scope.details = place;
                if ($scope.details.website) {
                    $('.name').attr('href', $scope.details.website);
                }
                else {
                    $('.name').attr('href', $scope.details.url);
                } 
            }
        });
    }

};
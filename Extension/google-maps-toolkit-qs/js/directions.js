/***********************************
** Directions
************************************/
function drawDirections(directionsCube, directionsProperties, app, divId){
	// empty the direction panel
	$('#mapext_' + divId + ' #directionsPanel').empty();

	// setup the display service API objects
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel($('#mapext_' + divId + ' #directionsPanel').get(0));

	var valid_travel_method = false;
	var travel_mode;
	switch (directionsProperties.drivingModeConfig.drivingMode){
		case "DRIVING": travel_mode=google.maps.TravelMode.DRIVING;
						valid_travel_method=true;
			     		break;
		case "WALKING": travel_mode=google.maps.TravelMode.WALKING;
						valid_travel_method=true;
			     		break;
		case "TRANSIT": travel_mode=google.maps.TravelMode.TRANSIT;
						valid_travel_method=true;
			     		break;
		default: 		valid_travel_method=false;
				 		break;
	}

	//Simple A-to-B directions
	if(directionsProperties.simpleDirections){
		var start = new google.maps.LatLng(directionsProperties.startCoordinates.lat, directionsProperties.startCoordinates.lng);
		var end = new google.maps.LatLng(directionsProperties.endCoordinates.lat, directionsProperties.endCoordinates.lng);
	
		var request = {
		      origin:start,
		      destination:end,
		      travelMode: valid_travel_method ? travel_mode : google.maps.TravelMode.DRIVING
		  };

		  directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      	directionsDisplay.setDirections(response);
		    }
		  });
	  }else{
	  	var coordinates=[];
	  	for (var i=0;i<directionsCube.qHyperCube.qDataPages[0].qArea.qHeight;i++){
	  		var row = directionsCube.qHyperCube.qDataPages[0].qMatrix[i];
	  		if(row[0].qText!='-' && row[1].qText!='-'){
	  			var lat_lng_original = JSON.parse(row[0].qText);
	  			coordinates.push([lat_lng_original[1],lat_lng_original[0]]);//inverting the coordinates since they are originaly sent as long lat 
	  		}
	  	}
	  	var start = new google.maps.LatLng(parseFloat(coordinates[0][0]), parseFloat(coordinates[0][1]));
	  	var end = new google.maps.LatLng(parseFloat(coordinates[coordinates.length-1][0]), parseFloat(coordinates[coordinates.length-1][1]));

	  	var waypts=[];
	  	for(var i=1; i<coordinates.length-1;i++){
	  		waypts.push({
	  				location: new google.maps.LatLng(parseFloat(coordinates[i][0]), parseFloat(coordinates[i][1])),
	  				stopover: true
	  		});
	  	}

		var request = {
		    origin:start,
		    destination:end,
		    waypoints: waypts,
		    travelMode: valid_travel_method ? travel_mode : google.maps.TravelMode.DRIVING,
		    optimizeWaypoints: false
		};

		directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		    	directionsDisplay.setOptions({ suppressMarkers: directionsProperties.hasConfiguredMarkers });
		      	directionsDisplay.setDirections(response);
		    }
		});

	  }
}
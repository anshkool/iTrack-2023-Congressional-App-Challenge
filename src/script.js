let trainDuration, totalDuration;

function storeTime() {
    var timeInput = document.getElementById("timeInput");
    var selectedTime = timeInput.value;

    var durationText = document.getElementById('duration').innerHTML;
    var durationMatch = durationText.match(/(\d+) mins/);
    var minutesToDestination = durationMatch ? parseInt(durationMatch[1]) : 0;

    var selectedTimeParts = selectedTime.split(":");
    var selectedHours = parseInt(selectedTimeParts[0]);
    var selectedMinutes = parseInt(selectedTimeParts[1]);

    var newMinutes = selectedMinutes - minutesToDestination;
    var newHours = selectedHours;
    var startTimeTrain = 51;
    var endTimeTrain = 55;

    if (newMinutes < 0) {
        newMinutes += 60;
        newHours -= 1;
    }

    if (newHours < 0) {
        newHours = 0;
        newMinutes = 0;
    }

    const timeConflict = document.getElementById("timeConflict");

    if (newHours == 6 && newMinutes + trainDuration > startTimeTrain && newMinutes + trainDuration < endTimeTrain) {

        var temp = newMinutes + trainDuration;

        if (temp >= 60) {
            newHours = newHours + 1;
            newMinutes = newMinutes - 60;
        }

        var trainArrival = newHours.toString().padStart(2, '0') + ":" + temp.toString().padStart(2, '0');
        
        timeConflict.innerHTML = "Would you like to re-route?";
        totalDuration += (endTimeTrain - temp);
        document.getElementById('duration').innerHTML = 'Estimated Travel Duration: ' + formatDuration(totalDuration);

        var conflictMessage = "Alert: there is a time conflict. The train's travel time is from 6:" + startTimeTrain + " to 6:" + endTimeTrain + " and you would collide with the train at " + trainArrival + ". Making the new estimated time of arrival " + selectedHours + ":0" + (selectedMinutes + ((endTimeTrain - temp)));

        window.alert(conflictMessage);

        rerouteButton.style.visibility = "visible";
    }else{
        rerouteButton.style.visibility = "hidden";
    }

    var newTime = newHours.toString().padStart(2, '0') + ":" + newMinutes.toString().padStart(2, '0');

    console.log("Selected time: " + selectedTime);
    console.log("Minutes to destination: " + minutesToDestination);
    console.log("New time: " + newTime);

    const newTimeElement = document.getElementById("newTime");
    newTimeElement.innerHTML = "Leave at: " + newTime;
}

function showPosition(){
    //Todo: change lat and long to prefered locations

    var starting = "lat, long";
    var train = "lat, long";
    var finalDestination = "lat, long";

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        
        //Todo: change lat and long to prefered locations
        center: { lat: lat, lng: long }
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
    var trainDirectionsService = new google.maps.DirectionsService();
    var trainDirectionsDisplay = new google.maps.DirectionsRenderer({ map: map });

    var request = {
        origin: starting,
        destination: train,
        travelMode: 'DRIVING'
    };

    var request2 = {
        origin: train,
        destination: finalDestination,
        travelMode: 'DRIVING'
    };

    totalDuration = 0;

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
            var duration = result.routes[0].legs[0].duration.text;
            totalDuration += parseDuration(duration);

            
        }

        trainDirectionsService.route(request2, function (request2, status) {
            if (status === 'OK') {
                trainDirectionsDisplay.setDirections(request2);
                trainDuration = request2.routes[0].legs[0].duration.text;

                trainDuration = parseDuration(trainDuration);
                totalDuration += trainDuration;

                console.log(totalDuration);

                document.getElementById('duration').innerHTML = 'Estimated Travel Duration: ' + formatDuration(totalDuration);
            }
        });
    });

    storeTime();
}



function reroute() {
    //Todo: change lat and long to prefered locations
    var starting = "lat, long";
    var train = "lat, long";
    var finalDestination = "lat, long";

    var oldMapDiv = document.getElementById('map');
    oldMapDiv.innerHTML = '';

    var map = new google.maps.Map(oldMapDiv, {
        zoom: 8,

        //Todo: change lat and long to prefered locations
        center: { lat: lat, lng: long }
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
    var trainDirectionsService = new google.maps.DirectionsService();
    var trainDirectionsDisplay = new google.maps.DirectionsRenderer({ map: map });

    var request = {
        origin: starting,
        destination: train,
        travelMode: 'DRIVING'
    };

    var request2 = {
        origin: train,
        destination: finalDestination,
        travelMode: 'DRIVING'
    }

    totalDuration = 0;
    trainDuration = 0;

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
            var duration = result.routes[0].legs[0].duration.text;
            totalDuration += parseDuration(duration);
        }

        trainDirectionsService.route(request2, function (request2, status) {
            if (status === 'OK') {
                trainDirectionsDisplay.setDirections(request2);
                trainDuration = request2.routes[0].legs[0].duration.text;

                trainDuration = parseDuration(trainDuration);

                console.log(trainDuration);
                totalDuration += trainDuration;

                
                document.getElementById('duration').innerHTML = 'Estimated Travel Duration: ' + formatDuration(totalDuration);
                document.getElementById('successMessage').innerHTML = 'You have saved: 5 mins';

            }
        });
    });


}

function confirmReroute() {
    const confirmed = window.confirm("Are you sure you want to re-route?");
    if (confirmed) {
        reroute();
    }
}



function parseDuration(duration) {
    var matches = duration.match(/(\d+) min/);
    if (matches) {
        return parseInt(matches[1]);
    }
    return 0;
}

function formatDuration(minutes) {
    return minutes + " mins";
}
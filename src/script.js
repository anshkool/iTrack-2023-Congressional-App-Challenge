let trainDuration, totalDuration;

function storeTime() {
    var timeInput = document.getElementById("timeInput");
    var selectedTime = timeInput.value;

    // Get the duration from the directions result
    var durationText = document.getElementById('duration').innerHTML;
    var durationMatch = durationText.match(/(\d+) mins/); // Extract minutes from the duration
    var minutesToDestination = durationMatch ? parseInt(durationMatch[1]) : 0;

    // Parse the selected time into hours and minutes
    var selectedTimeParts = selectedTime.split(":");
    var selectedHours = parseInt(selectedTimeParts[0]);
    var selectedMinutes = parseInt(selectedTimeParts[1]);

    // Calculate the new time
    var newMinutes = selectedMinutes - minutesToDestination;
    var newHours = selectedHours;
    var startTimeTrain = 51;
    var endTimeTrain = 55;

    // Adjust hours if the new minutes are negative
    if (newMinutes < 0) {
        newMinutes += 60;
        newHours -= 1;
    }

    // Ensure the new time is in a valid time format
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
        // timeConflict.innerHTML = "Alert: there is a time conflict. The train will from 6:" + startTimeTrain + " to 6:" + endTimeTrain + " and you would collide with the train at " + trainArrival + ". Making the new estimated time of arrival " + selectedHours + ":0" + (selectedMinutes + ((endTimeTrain - temp))) + ". Would you like to Re-Route?";
        timeConflict.innerHTML = "Would you like to re-route?";
        totalDuration += (endTimeTrain - temp);
        document.getElementById('duration').innerHTML = 'Estimated Travel Duration: ' + formatDuration(totalDuration);

        // Extract the content of the timeConflict element
        var conflictMessage = "Alert: there is a time conflict. The train's travel time is from 6:" + startTimeTrain + " to 6:" + endTimeTrain + " and you would collide with the train at " + trainArrival + ". Making the new estimated time of arrival " + selectedHours + ":0" + (selectedMinutes + ((endTimeTrain - temp)));

        // Show the timeConflict message in an alert
        window.alert(conflictMessage);

        rerouteButton.style.visibility = "visible";
    }else{
        rerouteButton.style.visibility = "hidden";
    }

    // Format the new time
    var newTime = newHours.toString().padStart(2, '0') + ":" + newMinutes.toString().padStart(2, '0');

    console.log("Selected time: " + selectedTime);
    console.log("Minutes to destination: " + minutesToDestination);
    console.log("New time: " + newTime);

    const newTimeElement = document.getElementById("newTime");
    newTimeElement.innerHTML = "Leave at: " + newTime;
}




function showPosition(){
    var starting = "40.526633144461215,-88.9348480510794";
    var train = "40.51513991712285,-88.97379315393539";
    var finalDestination = "40.51596228914597,-88.99600372507663";

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 40.51513991712285, lng: -88.97379315393539 }
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

    totalDuration = 0; // Initialize the total duration to 0

    

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
            var duration = result.routes[0].legs[0].duration.text;
            totalDuration += parseDuration(duration); // Sum the durations

            
        }

        trainDirectionsService.route(request2, function (request2, status) {
            if (status === 'OK') {
                trainDirectionsDisplay.setDirections(request2);
                trainDuration = request2.routes[0].legs[0].duration.text;

                trainDuration = parseDuration(trainDuration);
                totalDuration += trainDuration; // Sum the durations

                console.log(totalDuration);

                // Display the total duration
                document.getElementById('duration').innerHTML = 'Estimated Travel Duration: ' + formatDuration(totalDuration);
            }
        });
    });

    storeTime();
}



function reroute() {
    // Get the new origin and destination coordinates (you need to define them)
    var starting = "40.526633144461215,-88.9348480510794";
    var train = "40.52288801876845,-88.96189283370978";
    var finalDestination = "40.51596228914597,-88.99600372507663";

    // Remove the old map and its associated <div>
    var oldMapDiv = document.getElementById('map');
    oldMapDiv.innerHTML = ''; // Remove the old map content

    // Create a new map with the updated origin and destination
    var map = new google.maps.Map(oldMapDiv, {
        zoom: 8,
        center: { lat: 40.526633144461215, lng: -88.9348480510794 }, // Set the new origin coordinates
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



// let trainDuration;

// let totalDuration;

// const showError = (error) => {
//     let errorMessage = "An unknown error occurred.";

//     switch (error.code) {
//         case error.PERMISSION_DENIED:
//             errorMessage = "User denied the request for Geolocation.";
//             break;
//         case error.POSITION_UNAVAILABLE:
//             errorMessage = "Location information is unavailable.";
//             break;
//         case error.TIMEOUT:
//             errorMessage = "The request to get user location timed out.";
//             break;
//     }

//     alert(errorMessage);
// };

// // function storeTime() {
// //     var timeInput = document.getElementById("timeInput");
// //     var selectedTime = timeInput.value;

// //     // Get the duration from the directions result
// //     var durationText = document.getElementById('duration').innerHTML;
// //     var durationMatch = durationText.match(/(\d+) mins/); // Extract minutes from the duration
// //     var minutesToDestination = durationMatch ? parseInt(durationMatch[1]) : 0;

// //     // Parse the selected time into hours and minutes
// //     var selectedTimeParts = selectedTime.split(":");
// //     var selectedHours = parseInt(selectedTimeParts[0]);
// //     var selectedMinutes = parseInt(selectedTimeParts[1]);

// //     // Calculate the new time
// //     var newMinutes = selectedMinutes - minutesToDestination;
// //     var newHours = selectedHours;

// //     // Adjust hours if the new minutes is negative
// //     while (newMinutes < 0) {
// //         newMinutes += 60;
// //         newHours -= 1;
// //     }

// //     // Calculate train arrival time
// //     var trainArrivalMinutes = newMinutes + trainDuration;
// //     var trainArrivalHours = newHours;

// //     // Adjust hours if the train arrival minutes exceed 59
// //     while (trainArrivalMinutes > 59) {
// //         trainArrivalMinutes -= 60;
// //         trainArrivalHours += 1;
// //     }

// //     // Define train hours of operation
// //     var startTimeTrain = 6;
// //     var endTimeTrain = 7;

// //     // Check for time conflict
// //     if (
// //         newHours === 6 &&
// //         trainArrivalHours === 6 &&
// //         trainArrivalMinutes >= startTimeTrain &&
// //         trainArrivalMinutes <= endTimeTrain
// //     ) {
// //         // There is a time conflict
// //         timeConflict.innerHTML = "There is a Time Conflict. Train comes from 6:" + startTimeTrain + " to 6:" + endTimeTrain + " and you would collide with the train at " + trainArrivalHours.toString().padStart(2, '0') + ":" + trainArrivalMinutes.toString().padStart(2, '0') + ". Making the new estimated time of arrival " + selectedHours + ":" + (selectedMinutes + (endTimeTrain - trainArrivalMinutes)).toString().padStart(2, '0');
// //     } else {
// //         // No time conflict
// //         timeConflict.innerHTML = "";

// //         // Ensure the new time is in a valid time format
// //         if (newHours < 0) {
// //             newHours = 0;
// //             newMinutes = 0;
// //         }

// //         // Format the new time
// //         var newTime = newHours.toString().padStart(2, '0') + ":" + newMinutes.toString().padStart(2, '0');

// //         console.log("Selected time: " + selectedTime);
// //         console.log("Minutes to destination: " + minutesToDestination);
// //         console.log("New time: " + newTime);

// //         const newTimeElement = document.getElementById("newTime");
// //         newTimeElement.innerHTML = "Leave at: " + newTime;
// //     }
// // }

// function storeTime() {
//     var timeInput = document.getElementById("timeInput");
//     var selectedTime = timeInput.value;

//     // Get the duration from the directions result
//     var durationText = document.getElementById('duration').innerHTML;
//     var durationMatch = durationText.match(/(\d+) mins/); // Extract minutes from the duration
//     var minutesToDestination = durationMatch ? parseInt(durationMatch[1]) : 0;

//     // Parse the selected time into hours and minutes
//     var selectedTimeParts = selectedTime.split(":");
//     var selectedHours = parseInt(selectedTimeParts[0]);
//     var selectedMinutes = parseInt(selectedTimeParts[1]);

//     // Calculate the new time
//     var newMinutes = selectedMinutes - minutesToDestination;
//     var newHours = selectedHours;
//     var startTimeTrain = 51;
//     var endTimeTrain = 55;

//     // Adjust hours if the new minutes is negative
//     if (newMinutes < 0) {
//         newMinutes += 60;
//         newHours -= 1;
//     }

//     // Ensure the new time is in a valid time format
//     if (newHours < 0) {
//         newHours = 0;
//         newMinutes = 0;
//     }

//     const timeConflict = document.getElementById("timeConflict");

//     if(newHours == 6 && newMinutes+trainDuration>startTimeTrain && newMinutes+trainDuration<endTimeTrain){

//         var temp = newMinutes + trainDuration;

//         if(temp >= 60){
//             newHours = newHours + 1;
//             newMinutes = newMinutes - 60;
//         }

//         rerouteButton.style.display = "block";

//         var trainArrival = newHours.toString().padStart(2, '0') + ":" + temp.toString().padStart(2, '0');
//         timeConflict.innerHTML = "There is a Time Conflict. Train comes from 6:" + startTimeTrain + " to 6:" + endTimeTrain+ " and you would collide with the train at " + trainArrival + ". Making the new estimated time of arrival " + selectedHours + ":0" + (selectedMinutes + ((endTimeTrain-temp)));
//         document.getElementById('duration').innerHTML = 'Estimated Duration: ' + formatDuration(totalDuration + (endTimeTrain-temp))
//     }

//     // Format the new time
//     var newTime = newHours.toString().padStart(2, '0') + ":" + newMinutes.toString().padStart(2, '0');

//     console.log("Selected time: " + selectedTime);
//     console.log("Minutes to destination: " + minutesToDestination);
//     console.log("New time: " + newTime);

//     const newTimeElement = document.getElementById("newTime");
//     newTimeElement.innerHTML = "Leave at: " + newTime;
// }




// function showPosition(){
//     var starting = "40.526633144461215,-88.9348480510794";
//     var train = "40.51513991712285,-88.97379315393539";
//     var finalDestination = "40.51596228914597,-88.99600372507663";

//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: { lat: 40.51513991712285, lng: -88.97379315393539 }
//     });

//     var directionsService = new google.maps.DirectionsService();
//     var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
//     var trainDirectionsService = new google.maps.DirectionsService();
//     var trainDirectionsDisplay = new google.maps.DirectionsRenderer({ map: map });

//     var request = {
//         origin: starting,
//         destination: train,
//         travelMode: 'DRIVING'
//     };

//     var request2 = {
//         origin: train,
//         destination: finalDestination,
//         travelMode: 'DRIVING'
//     };

//     totalDuration = 0; // Initialize the total duration to 0

    

//     directionsService.route(request, function (result, status) {
//         if (status === 'OK') {
//             directionsDisplay.setDirections(result);
//             var duration = result.routes[0].legs[0].duration.text;
//             totalDuration += parseDuration(duration); // Sum the durations
//         }

//         trainDirectionsService.route(request2, function (request2, status) {
//             if (status === 'OK') {
//                 trainDirectionsDisplay.setDirections(request2);
//                 trainDuration = request2.routes[0].legs[0].duration.text;

//                 trainDuration = parseDuration(trainDuration);
//                 totalDuration += trainDuration; // Sum the durations
//      // Sum the durations

//                 console.log(totalDuration);

//                 // Display the total duration
//                 document.getElementById('duration').innerHTML = 'Route Takes: ' + formatDuration(totalDuration);
//             }
//         });
//     });
// }



// function reroute() {
//     // Get the new origin and destination coordinates (you need to define them)
//     var starting = "40.526633144461215,-88.9348480510794";
//     var train = "40.52288801876845,-88.96189283370978";
//     var finalDestination = "40.51596228914597,-88.99600372507663";

//     // Remove the old map and its associated <div>
//     var oldMapDiv = document.getElementById('map');
//     oldMapDiv.innerHTML = ''; // Remove the old map content

//     // Create a new map with the updated origin and destination
//     var map = new google.maps.Map(oldMapDiv, {
//         zoom: 8,
//         center: { lat: 40.526633144461215, lng: -88.9348480510794 }, // Set the new origin coordinates
//     });

//     var directionsService = new google.maps.DirectionsService();
//     var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
//     var trainDirectionsService = new google.maps.DirectionsService();
//     var trainDirectionsDisplay = new google.maps.DirectionsRenderer({ map: map });

//     var request = {
//         origin: starting,
//         destination: train,
//         travelMode: 'DRIVING'
//     };

//     var request2 = {
//         origin: train,
//         destination: finalDestination,
//         travelMode: 'DRIVING'
//     }

//     totalDuration = 0;
//     trainDuration = 0;

//     directionsService.route(request, function (result, status) {
//         if (status === 'OK') {
//             directionsDisplay.setDirections(result);
//             var duration = result.routes[0].legs[0].duration.text;
//             totalDuration += parseDuration(duration);
//         }

//         trainDirectionsService.route(request2, function (request2, status) {
//             if (status === 'OK') {
//                 trainDirectionsDisplay.setDirections(request2);
//                 trainDuration = request2.routes[0].legs[0].duration.text;

//                 trainDuration = parseDuration(trainDuration);

//                 console.log(trainDuration);
//                 totalDuration += trainDuration;

                
//                 document.getElementById('duration').innerHTML = 'Estimated Duration: ' + formatDuration(totalDuration);
//             }
//         });
//     });
// }


// function parseDuration(duration) {
//     var matches = duration.match(/(\d+) min/);
//     if (matches) {
//         return parseInt(matches[1]);
//     }
//     return 0;
// }

// function formatDuration(minutes) {
//     return minutes + " Minutes";
// }
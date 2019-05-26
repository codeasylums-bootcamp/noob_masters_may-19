

function initMap(){
      var options = {
        zoom:8,
        center:{lat:12.9716,lng:77.5946}
      }
      // New map
      var map = new google.maps.Map(document.getElementById('map'), options);

    var locationForm = document.getElementById('location-form');

  locationForm.addEventListener('submit', geocode);

  function geocode(e){
    // Prevent actual submit
    e.preventDefault();

    var location = document.getElementById('location-input').value;
    var destination = document.getElementById('destination-input').value;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
      params:{
        address:{location,destination} ,
        key:'AIzaSyDUUew1EVhWN-cOGDKXI02QxsrzRtdhRQY'
      }
    })
    .then(function(response){
      // Log full response
      console.log(response);

      // Formatted Address
      var formattedAddress = response.data.results[1].formatted_address;
      var formattedAddressOutput = `
        <ul class="list-group">
          <li class="list-group-item">${formattedAddress}</li>
        </ul>
      `;
      // Address Components
      var addressComponents = response.data.results[1].address_components;
      var addressComponentsOutput = '<ul class="list-group">';
      for(var i = 0;i < addressComponents.length;i++){
        addressComponentsOutput += `
          <li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
        `;
      }
      addressComponentsOutput += '</ul>';

      // Geometry
      var latl = response.data.results[0].geometry.location.lat;
      var lngl = response.data.results[0].geometry.location.lng;
      var latd = response.data.results[1].geometry.location.lat;
      var lngd = response.data.results[1].geometry.location.lng;
      //console.log(lngl);
      var geometryOutput = `
        <ul class="list-group">
          <li class="list-group-item"><strong>Latitude</strong>: ${latd}</li>
          <li class="list-group-item"><strong>Longitude</strong>: ${lngd}</li>
        </ul>
      `;

      // Output to app
      document.getElementById('formatted-address').innerHTML = formattedAddressOutput;
      document.getElementById('address-components').innerHTML = addressComponentsOutput;
      document.getElementById('geometry').innerHTML = geometryOutput;
    latl = parseFloat(latl);
    lngl = parseFloat(lngl);
    latd = parseFloat(latd);
    lngd = parseFloat(lngd);
    loc = new google.maps.LatLng(latl,lngl);
    //console.log(loc);
    dest = new google.maps.LatLng(latd,lngd);

    })
    .catch(function(error){
      console.log(error);
    });

    var display = new google.maps.DirectionsRenderer();
    var services = new google.maps.DirectionsService();
    display.setMap(map);
    function calculateroute(loc,dest){
      var request ={
        origin : dest,
        destination:loc,
        travelMode: 'DRIVING'
      };
      services.route(request,function(result,status){
        //console.log(result,status);
        if(status =='OK'){
          display.setDirections(result);
        }
      });
    }
    document.getElementById('getdirection').onclick= function(){
      calculateroute(dest,loc);
            calculateDistance(dest,loc);
            document.getElementById('destination-input').value='';
            document.getElementById('destination-input').setAttribute("placeholder","Enter next destination")
    }

  }}

  function calculateDistance() {
            var origin = loc
            var destination = dest
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    console.log(response);
    if (status !== 'OK') {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
    //  var outputDiv = document.getElementById('output');
      //outputDiv.innerHTML = '';
      //deleteMarkers(markersArray);
      var ul = document.getElementById("myUL");
     // var distance = document.getElementById("distance");
      //var time = document.getElementById("time");
      var dist=[];
      var time=[];
      dist.push(response.rows[0].elements[0].distance.text);
      time.push(response.rows[0].elements[0].duration.text);
      for(var i=0;i<dist.length;i++){
        var li = document.createElement("li");
        li.innerHTML = document.getElementById('formatted-address').innerText + ". Distance is " + dist[i] + " and time is " + time[i];
        ul.appendChild(li);
      }

    }
  });

        }

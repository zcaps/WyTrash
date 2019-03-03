console.log("Welcome to client-side script")

// GOOGLE MAPS
var map, locations;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var rowsN = 0;
var pinTable = [];
var pinReactor = [];
var selection = -1;
var pinCloser = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.9606384, lng: -83.9207392},
    zoom: 15
  });
}

function updateAddressStatus(center){
  $('#address-result').text("Calculating...")
  for(pin in pinTable){
    if ((Math.abs(pinTable[pin].lat - center.lat) < 0.0003) 
    || (Math.abs(pinTable[pin].long - center.lng) < 0.0003)){
      $('#address-result').text("Keep your trash you filthy animal. "+pinTable[pin].complaint);
      return true;
    }
  }
  $('#address-result').text("You're trash has been taken.");
}


function updateTable(data){
  // console.log(data)
  for(key in data){
    let row = $("<tr>", {"class":"rowNode", "id":"node"+rowsN});

    // Pin's label
    let col = $("<td>", {"class":"rowData"}).text(labels[rowsN++ % labels.length])
    row.append(col);

    // Pin's complaint
    col = $("<td>", {"class":"rowData"}).text(data[key].complaint)
    row.append(col);

    // Pin's picture
    let picLink = $("<img>", {"class":"list-thumbnail","src":data[key].imgName})
    col = $("<td>", {"class":"rowData"}).html(picLink)
    row.append(col);

    // Attach newly built row
    $("#report-table-body").append(row);

    // Add to [global]pinTable
    pinTable.push(data[key]);
  }

}
function updateMap(data){
  console.log(data)
  var myLatlng;

  for(key in data){
    console.log(data[key])
    myLatlng = new google.maps.LatLng(data[key].lat, data[key].long);

    var infowindow = new google.maps.InfoWindow({
      content: "<div style='color:black;'>\
                <p>"+data[key].complaint+"</p>\
                <img src='https://storage.googleapis.com/whyismytrashstillhere.com/1551600088.285217.jpeg'></div>"
                // <img src='"+data[key].imgName+"'></div>"
    })

    var marker = new google.maps.Marker({
        position: myLatlng,
        title:data[key].complaint,
        label: labels[(rowsN + key) % labels.length]
    });
    google.maps.event.addListener(marker,'click', (function(marker,infowindow){ 
      let func = function() {
          // infowindow.setContent();
          infowindow.open(map,marker);
      };
      let closer = function(){
        infowindow.close(map, marker);
      }
      pinReactor.push(func);
      pinCloser.push(closer)
      return func;
    })(marker,infowindow)); 
    marker.setMap(map);
  }
}

function geocodeSearch(query){
  if(query === ""){ console.log("pfft, gtfo"); return false; }
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address':query}, function(results, status){
    let lat = results[0].geometry.location.lat();
    let lng = results[0].geometry.location.lng();
    let center = {lat:lat, lng:lng};
    console.log(lat);
    console.log(lng);
    map.setCenter(center);
    updateAddressStatus(center);

    /*      If we're mapping pins... which we aren't...

    data = {positions:[{lat:"",lng:""}]};
    data.positions[0].lat = lat
    data.positions[0].lng = lng                  */
    // Don't add the pin on a map. Center map view on pin, and update status to...
    // Give estimate on route...
    // If within 24 hours, check for reports within 100 feet, provide feedback
    // updateMap(data);
  })
  return true;
}

// Event Callbacks
function addressLookupClick(){
  console.log("Searching ", $('#address-lookup').val());
  geocodeSearch($('#address-lookup').val());
}

$(function(){
  $.get("/trip-report", function(data,status){
    console.log("Data: ", data);
    console.log("Status: ", status);
    // console.log(data);
    updateMap(data);
    updateTable(data);
  })

  // Event Listeners
  $('#address-lookup').keypress(function(e){
    if(e.keyCode == 13) addressLookupClick();
  })
  $('#address-lookup-btn').click(addressLookupClick)
  $('#report-container').on("click",".rowNode",function(){
    if(selection != -1)
      pinCloser[selection]();
    selection = $(this).attr("id").substring(4);
    let center = {lat:pinTable[selection].lat, lng:pinTable[selection].long}
    map.setCenter(center);
    pinReactor[selection]();

  })
})
  /////////////////////////////////////////
  ///////////    TRASH      ///////////////
  /////////////////////////////////////////
  // Pre-loaded cluster
  // var markers = locations.map(function(location, i) {
  //   return new google.maps.Marker({
  //     position: location,
  //     label: labels[i % labels.length]
  //   });
  // });
  // var markerCluster = new MarkerClusterer(map, markers,
  //   {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  
  // <!-- <script>
  //   var myLatlng = new google.maps.LatLng(35,-84);
  //   var mapOptions = {
  //     zoom: 4,
  //     center: myLatlng
  //   }
  //   // I'm using 
  //   // var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  //   var marker = new google.maps.Marker({
  //       position: myLatlng,
  //       title:"Hello World!"
  //   });
  //   // To add the marker to the map, call setMap();
  //   // map is a global variable defined in client.js
  //   marker.setMap(map);
  // </script> -->

    // for(key in map.markers){
    // }
  // var markers = data.positions.map(function(location, i) {
  //   return new google.maps.Marker({
  //     position: location,
  //     label: labels[i % labels.length]
  //   });
  // });
  // for(i in markers)

  // <!-- Map Initial Load -->
  // <!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2BkiI59erV23pjx7bfHwvVniaqQFyVLg&callback=initMap" ></script> -->
  // <!-- Marker Clusters -->
  // <!-- <script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script> -->
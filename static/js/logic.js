// MINE
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

var centerCoords = [37, -122];

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: centerCoords,
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);




}
  
function createMarkers(response) {
    // Pull the "stations" property off of response.data
    var features = response.features;

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.mag + "</h3>");
    }

    var edata = L.geoJSON(features, {
      onEachFeature: onEachFeature
    });

    // Initialize an array to hold markers
    // var quakeMarkers = [];

    // // Loop through the array
    // for (var i = 0; i < features.length; i++) {
    //     var quake = features[i];

    //     //console.log(quake.properties.mag)
    //     var loc = [quake.geometry.coordinates[0], quake.geometry.coordinates[1]];

    //     // For each quake, create a marker and bind a popup with the station's name
    //     var quakeMarker = L.marker(loc);
    //     //.bindPopup("<h3>" + quake.properties.mag + "</h3>");


    //     // Add the marker to the array
    //     quakeMarkers.push(quakeMarker);
    // }
    // //console.log(quakeMarkers)

    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(edata);
}
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json(url, function(data) {
    createMarkers(data);
  });
  
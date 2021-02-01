// MINE
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

var centerCoords = [34, -122];

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
      zoom: 6,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

}
  

var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "pink",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 1
};


function createMarkers(response) {
    // Pull the "stations" property off of response.data
    var features = response.features;

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.mag + "</h3>");
    }

    var edata = L.geoJSON(features, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      style: function(feature) {
          let myMag = feature.properties.mag;
          let rad = myMag * 5.1 - 5;
          let opac = 1 - 1.1 / myMag;
          let style = {
            'radius': rad,
            'fillOpacity': opac,
            'fillColor': 'red'
          }
         return style 
        }
    });

    createMap(edata);
}
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json(url, function(data) {
    createMarkers(data);
  });
  
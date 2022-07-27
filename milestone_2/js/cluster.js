let markers
let finalData

function getMinMax(data) {
  let min = "";
  let max = "";

  for (i = 0; i < data[0].length; i++) {
    if (min == "" || min > data[0][i].Date) {
      min = data[0][i].Date
    }

    if (max == "" || max < data[0][i].Date) {
      max = data[0][i].Date
    }
  }

  return [min, max];
}

function generateSlider(map, data) {
  minMax = getMinMax(data)

  $(function() {
    $("#slider-range").slider({
      range: true,
      min: new Date(minMax[0]).getTime() / 1000,
      max: new Date(minMax[1]).getTime() / 1000,
      step: 86400,
      values: [new Date(minMax[0]).getTime() / 1000, new Date(minMax[1]).getTime() / 1000],
      slide: function(event, ui) {
        $("#amount").val((new Date(ui.values[0] * 1000).toDateString()) + " - " + (new Date(ui.values[1] * 1000)).toDateString());
        markers.remove();
        markers = L.markerClusterGroup();
        
        let filter = [];

        for (i = 0; i < finalData.length; i++) {
          if (new Date(finalData[i].Date).getTime() > new Date(ui.values[0] * 1000) && new Date(finalData[i].Date).getTime() < new Date(ui.values[1] * 1000)) {
            filter.push(finalData[i])
          }
        }

        console.log(filter.length)

        for (i = 0; i < filter.length; i++) {
          let date = filter[i].Date;
          let location = filter[i].Location;
          let lat = filter[i].Lat;
          let long = filter[i].Long;

          let marker = L.marker(new L.LatLng(lat, long), {
            title: location
          });
          marker.bindPopup(
            "<b>" + location + "</b><br>" +
            "Date: " + new Date(date).toDateString() + "<br>"
          )
          markers.addLayer(marker);
        }

        map.addLayer(markers);
      }
    });
    $("#amount").val((new Date($("#slider-range").slider("values", 0) * 1000).toDateString()) +
      " - " + (new Date($("#slider-range").slider("values", 1) * 1000)).toDateString());
  });
}

function generateCluster(map) {
  // Load external data
  Promise.all([d3.csv("data/covid.csv")]).then(data => {
    generateSlider(map, data)
    finalData = data[0]

    for (i = 0; i < data[0].length; i++) {
      let date = data[0][i].Date;
      let location = data[0][i].Location;
      let lat = data[0][i].Lat;
      let long = data[0][i].Long;

      let marker = L.marker(new L.LatLng(lat, long), {
        title: location
      });
      marker.bindPopup(
        "<b>" + location + "</b><br>" +
        "Date: " + new Date(date).toDateString() + "<br>"
      )
      markers.addLayer(marker);
    }

    map.addLayer(markers);
  })
}

window.onload = function() {
  markers = L.markerClusterGroup();
  let map = L.map('map').setView([1.3521, 103.8198], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxzoom: 12,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setMaxBounds([
    [1.59000, 104.11475],
    [1.023736, 103.590461],
  ]);

  generateCluster(map)
}

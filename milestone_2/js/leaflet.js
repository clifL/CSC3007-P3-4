let geoInfo
let legend
let finalData
let globSgMap
let filter
let percentage
let markers
let finalDataCluster

let clinic = [{
  'clinic': "Peak Medical Clinic",
  'lat': 1.360320,
  'long': 103.944397,
  'desc': "8am–1pm, 6–10pm"
}, {
  'clinic': "Woods Medical Clinic Pte Ltd",
  'lat': 1.321410,
  'long': 103.956009,
  'desc': "10am–1:30pm, 6:30–8:30pm"
}, {
  'clinic': "NHGP Toa Payoh Polyclinic",
  'lat': 1.339040,
  'long': 103.857590,
  'desc': "8am–1pm, 2-4:30pm"
}, {
  'clinic': "Kallang Polyclinic",
  'lat': 1.316930,
  'long': 103.859470,
  'desc': "7:30am–1pm, 2–4:30pm"
}, {
  'clinic': "SingHealth Polyclinics - Outram",
  'lat': 1.2796,
  'long': 103.8384,
  'desc': "8am–1pm, 1:30–4pm"
}, {
  'clinic': "SingHealth Polyclinics - Marine Parade",
  'lat': 1.3023,
  'long': 103.9076,
  'desc': "	8–11:30am, 1:30–4pm"
}, {
  'clinic': "NHGP Ang Mo Kio Polyclinic",
  'lat': 1.3743,
  'long': 103.8457,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "SingHealth Polyclinics - Sengkang",
  'lat': 1.3925,
  'long': 103.8944,
  'desc': "8am–12:30pm, 1:30–4:30pm"
}, {
  'clinic': "Hougang Polyclinic (NHGP)",
  'lat': 1.3700,
  'long': 103.8890,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "NHGP - Geylang Polyclinic",
  'lat': 1.3195749,
  'long': 103.88731,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "SingHealth Polyclinics - Bukit Merah",
  'lat': 1.3358497,
  'long': 103.8564199,
  'desc': "8am–4:30pm"
}, {
  'clinic': "SingHealth Polyclinics - Tampines",
  'lat': 1.3573,
  'long': 103.9460,
  'desc': "	8am–1pm, 2–4:30pm"
}, {
  'clinic': "Eunos Polyclinic",
  'lat': 1.3171,
  'long': 103.9057,
  'desc': "8am–1pm, 6–10pm"
}, {
  'clinic': "SingHealth Polyclinics - Bedok",
  'lat': 1.3269,
  'long': 103.932,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "Queenstown Polyclinic",
  'lat': 1.2985,
  'long': 103.8010,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "Clementi Polyclinic",
  'lat': 1.3126,
  'long': 103.7657,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "SingHealth Polyclinics - Punggol",
  'lat': 1.4026,
  'long': 103.9128,
  'desc': "7:30–11:30am, 1:30–4pm"
}, {
  'clinic': "SingHealth Polyclinics - Pasir Ris",
  'lat': 1.3683,
  'long': 103.9595,
  'desc': "7:30–11:30am, 1:30–4pm"
}, {
  'clinic': "L & H Polyclinic and Surgery",
  'lat': 1.2888,
  'long': 103.8143,
  'desc': "8:30am–12:30pm, 2–6pm"
}, {
  'clinic': "Choa Chu Kang Polyclinic (NUP)",
  'lat': 1.3823,
  'long': 103.7507,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "NHGP Yishun Polyclinic",
  'lat': 1.4305,
  'long': 103.8389,
  'desc': "8am–1pm, 2–4:30pm"
}, {
  'clinic': "NHGP Woodlands Polyclinic",
  'lat': 1.4308,
  'long': 103.7751,
  'desc': "8am–1pm, 2–4pm"
}];

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

function generateClusterSlider(map, data) {
  minMax = getMinMax(data)

  $(function() {
    $("#slider-range-cluster").slider({
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

        for (i = 0; i < finalDataCluster.length; i++) {
          if (new Date(finalDataCluster[i].Date).getTime() > new Date(ui.values[0] * 1000) && new Date(finalDataCluster[i].Date).getTime() < new Date(ui.values[1] * 1000)) {
            filter.push(finalDataCluster[i])
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
    $("#amountCluster").val((new Date($("#slider-range-cluster").slider("values", 0) * 1000).toDateString()) +
      " - " + (new Date($("#slider-range-cluster").slider("values", 1) * 1000)).toDateString());
  });
}

function getClusterColor(value) {
  if (value < 10) {
    color = "#6ECC3999";
  } else if (value < 100) {
    color = "#F0C20C99";
  } else {
    color = "#F1801799";
  }

  return color;
}

function getLegendCluster(legendCluster) {
  legendCluster.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Covid Cases</strong><br>'];
    cat = ['More than 100', '10 - 100', 'Less than 10'];
    catValues = [111, 11, 1];

    for (var i = 0; i < cat.length; i++) {
      div.innerHTML +=
        labels.push(
          '<i class="circle" style="background:' + getClusterColor(catValues[i]) + '"></i> ' +
          (cat[i] ? cat[i] : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  return legendCluster;
}

function generateCluster(map) {
  // Load external data
  Promise.all([d3.csv("data/covid.csv")]).then(data => {
    generateClusterSlider(map, data)
    finalDataCluster = data[0]

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

  legendCluster = L.control({
    position: 'bottomright'
  });
  legendCluster = getLegendCluster(legendCluster)
  legendCluster.addTo(map)
}

function compileData(population) {
  let finalData = {}

  population.forEach((zone) => {
    content = {}
    content['Population'] = Number.isNaN(parseInt(zone.Population)) ? 0 : parseInt(zone.Population);
    if (content['Population'] > 2000) {
      content['Covid'] = Math.floor((Math.random() * 2000));
    } else if (content['Population'] == 0) {
      content['Covid'] = 0;
    } else {
      content['Covid'] = Math.floor((Math.random() * content['Population']));
    }

    if (zone.Subzone == "Lakeside (Business)" || zone.Subzone == "Lakeside (Leisure)") {
      finalData['LAKESIDE'] = content
    } else {
      finalData[zone.Subzone.toUpperCase()] = content
    }
  });

  return finalData
}

function getColor(value) {
  if (percentage) {
    if (value < 10) {
      color = "#479b02";
    } else if (value < 25) {
      color = "#006fa1";
    } else if (value < 50) {
      color = "#FFCE03";
    } else if (value < 75) {
      color = "#FFA800";
    } else {
      color = "#d60000";
    }
  } else {
    if (value < 10) {
      color = "#479b02";
    } else if (value < 100) {
      color = "#006fa1";
    } else if (value < 500) {
      color = "#FFCE03";
    } else if (value < 1000) {
      color = "#FFA800";
    } else {
      color = "#d60000";
    }
  }

  return color;
}

function getGeoInfo(sgmap, compileData) {
  return L.geoJSON(sgmap, {
    onEachFeature: function(feature, layer) {
      let area = turf.area(feature.geometry);
      let per = 0
      let covid = 0
      try {
        covid = compileData[feature.properties.Name.toUpperCase()]['Covid'] || 0;
        population = compileData[feature.properties.Name.toUpperCase()]['Population'] || 0;
      } catch (err) {
        covid = 0;
        population = 0;
      }

      if (covid != 0 || population != 0) {
        per = Math.ceil(covid / population * 100)
      } else {
        per = 0
      }

      layer.bindPopup(
        "<b>" + feature.properties.Name + "</b><br>" +
        "Covid Cases: " + covid + "<br>" +
        "Population: " + population + "<br>" +
        "Percentage: " + per + "%<br>"
      )
    },
    // highlight feature on mouse over
    style: (feature) => {
      let area = turf.area(feature.geometry);
      let per = 0
      let covid = 0
      try {
        covid = compileData[feature.properties.Name.toUpperCase()]['Covid'] || 0;
        population = compileData[feature.properties.Name.toUpperCase()]['Population'] || 0;
      } catch (err) {
        covid = 0;
        population = 0;
      }

      if (covid != 0 || population != 0) {
        per = Math.ceil(covid / population * 100)
      } else {
        per = 0;
      }

      if (percentage) {
        covid = per;
      }
      return {
        fillColor: getColor(covid),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
      };
    }
  });
}

function setEachlayer(geoInfo) {
  return geoInfo.eachLayer(function(layer) {
    layer.on({
      mouseover: function(e) {
        this.openPopup();
        this.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.2
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          this.bringToFront();
        }
      },
      mouseout: function(e) {
        this.setStyle({
          weight: 1,
          opacity: 1,
          color: 'white',
          dashArray: '1',
          fillOpacity: 0.9
        });
      }
    });
  })
}

function getLegend(legend) {
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Covid Cases</strong><br>'];
    cat = ['More than 1000', '500 - 1000', '100 - 500', '10 - 100', 'Less than 10'];
    catValues = [1111, 511, 111, 11, 1];

    for (var i = 0; i < cat.length; i++) {
      div.innerHTML +=
        labels.push(
          '<i class="circle" style="background:' + getColor(catValues[i]) + '"></i> ' +
          (cat[i] ? cat[i] : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  return legend;
}

function getPercentageLegend(legend) {
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Covid Cases (%)</strong><br>'];
    cat = ['More than 75%', '50% - 75%', '25% - 50%', '10% - 25%', 'Less than 10%'];
    catValues = [80, 51, 27, 11, 1];

    for (var i = 0; i < cat.length; i++) {
      div.innerHTML +=
        labels.push(
          '<i class="circle" style="background:' + getColor(catValues[i]) + '"></i> ' +
          (cat[i] ? cat[i] : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  return legend;
}

function generateSlider(map) {
  let today = new Date();
  let weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  $(function() {
    $("#slider-range").slider({
      range: true,
      min: weekAgo.getTime() / 1000,
      max: today.getTime() / 1000,
      step: 86400,
      values: [weekAgo.getTime() / 1000, today.getTime() / 1000],
      slide: function(event, ui) {
        $("#amount").val((new Date(ui.values[0] * 1000).toDateString()) + " - " + (new Date(ui.values[1] * 1000)).toDateString());
        let diffTime = Math.abs(new Date(ui.values[1] * 1000) - new Date(ui.values[0] * 1000));
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        filter = JSON.parse(JSON.stringify(finalData));
        for (let key in filter) {
          if (filter.hasOwnProperty(key)) {
            filter[key]['Covid'] = Math.ceil(filter[key]['Covid'] * diffDays / 7);
          }
        }

        geoInfo.remove();
        geoInfo = getGeoInfo(globSgMap, filter, false);
        geoInfo = setEachlayer(geoInfo);
        geoInfo.addTo(map);
      }
    });
    $("#amount").val((new Date($("#slider-range").slider("values", 0) * 1000).toDateString()) +
      " - " + (new Date($("#slider-range").slider("values", 1) * 1000)).toDateString());
  });
}

function generateToggle(map) {
  $(function() {
    $('#toggle-event').change(function() {
      geoInfo.remove();
      legend.remove();
      if($(this).prop('checked')) {
        percentage = false
        geoInfo = getGeoInfo(globSgMap, filter);
        legend = getLegend(legend)
      } else {
        percentage = true
        geoInfo = getGeoInfo(globSgMap, filter);
        legend = getPercentageLegend(legend)
      }
      geoInfo = setEachlayer(geoInfo);
      geoInfo.addTo(map);
      legend.addTo(map)
    })
  })
}

function selectClinic(mapClinics) {
  $(function() {
    $('#clinic').change(function() {
      if (this.value != "default") {
        for (i = 0; i < clinic.length; i++) {
          if (clinic[i].clinic.toUpperCase() == this.value.toUpperCase()) {
            mapClinics.setView([clinic[i].lat, clinic[i].long], 17);
            break;
          }
        }
      } else {
        mapClinics.setView([1.3521, 103.8198], 11.5);
      }
    })
  })
}

function generateClinic(map) {
  for (i = 0; i < clinic.length; i++) {
    let name = clinic[i].clinic;
    let desc = clinic[i].desc;
    let lat = clinic[i].lat;
    let long = clinic[i].long;

    let marker = L.marker(new L.LatLng(lat, long), {
      title: name
    });
    marker.bindPopup(
      "<b>" + name.toUpperCase() + "</b><br>" +
      "Open Hrs: " + desc + "<br>"
    )
    map.addLayer(marker);
  }
}

function drawGeo(map) {
  // Load external data
  Promise.all([d3.json("data/sgmap.json"), d3.csv("data/population2021.csv")]).then(data => {
    percentage = false
    generateSlider(map)
    generateToggle(map)
    globSgMap = data[0]
    finalData = compileData(data[1])
    filter = JSON.parse(JSON.stringify(finalData));

    geoInfo = getGeoInfo(data[0], finalData);
    geoInfo = setEachlayer(geoInfo);
    geoInfo.addTo(map);

    legend = L.control({
      position: 'bottomright'
    });
    legend = getLegend(legend)
    legend.addTo(map)
  })
}

window.onload = function() {
  let map = L.map('map').setView([1.3521, 103.8198], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxzoom: 12,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setMaxBounds([
    [1.45000, 104.11475],
    [1.223736, 103.590461],
  ]);

  drawGeo(map);

  markers = L.markerClusterGroup();
  let mapCluster = L.map('map-cluster').setView([1.3521, 103.8198], 11.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxzoom: 12,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapCluster);

  mapCluster.setMaxBounds([
    [1.55000, 104.11475],
    [1.223736, 103.590461],
  ]);

  generateCluster(mapCluster)

  let mapClinics = L.map('map-clinic').setView([1.3521, 103.8198], 11.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxzoom: 12,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapClinics);

  mapClinics.setMaxBounds([
    [1.55000, 104.11475],
    [1.223736, 103.590461],
  ]);

  for (const clinicInfo of clinic) {
      $("#clinic").append("<option value='" + clinicInfo.clinic.toUpperCase() + "'>" + clinicInfo.clinic.toUpperCase() + "</option>");
  }

  generateClinic(mapClinics)

  selectClinic(mapClinics)
}

let geoInfo
let legend
let finalData
let globSgMap
let filter
let percentage

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
  let map = L.map('map').setView([1.3521, 103.8198], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxzoom: 12,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setMaxBounds([
    [1.49000, 104.11475],
    [1.023736, 103.590461],
  ]);

  drawGeo(map);
}

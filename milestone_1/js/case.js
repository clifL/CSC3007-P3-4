function compileData(sgmap, population) {
  let min = 0;
  let max = 0;
  let finalData = {}

  sgmap.features.forEach((feature) => {
    population.forEach((zone) => {
      if (
        feature.properties.Name.toUpperCase() == zone.Subzone.toUpperCase()
      ) {
        finalData[feature.properties.Name] = parseInt(zone.Population);

        if (zone.Population != "-" || min > parseInt(zone.Population) || min == 0) {
          min = parseInt(zone.Population)
        }

        if (max < parseInt(zone.Population) || max == 0) {
          max = parseInt(zone.Population)
        }
      }
    });
  });

  return [finalData, min, max]
}

function drawGeo() {
  let width = 1300,
    height = 670;

  let svg = d3.select("#svgId")
    .attr("viewBox", "0 0 " + width + " " + height)

  // Load external data
  Promise.all([d3.json("data/sgmap.json"), d3.csv("data/population2021.csv")]).then(data => {
    listData = compileData(data[0], data[1])
    console.log(listData)

    let myColor = d3.scaleLinear()
      .domain([listData[1], listData[2]])
      .range(["#FFD8CC", "#FF3632"]);

    var legend = d3
      .legendColor()
      .scale(myColor)
      .shapeWidth(200)
      .labels([listData[1], listData[2]])
      .orient("horizontal")
      .title("Number of Covid Cases");

    // Map and projection
    var projection = d3.geoMercator()
      .center([103.851959, 1.290270])
      .fitExtent([
        [20, 20],
        [980, 580]
      ], data[0]);

    let geopath = d3.geoPath().projection(projection);

    svg.append("g")
      .attr("id", "districts")
      .selectAll("path")
      .data(data[0].features)
      .enter()
      .append("path")
      .attr("d", geopath)
      .attr("fill", function(d) {
        d.total = listData[0][d.properties.Name] || 0;
        return myColor(d.total);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("fill", function() {
          return d3.rgb(d3.select(event.currentTarget).style("fill")).darker(0.5);
        });
        d3.select(".tooltip")
          .text(
            d.properties.Name +
            ", Covid Cases: " +
            listData[0][d.properties.Name]
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px")
          .style("opacity", 1);

        let path = d3.select(event.currentTarget)
        path.style("stroke", "orange").style("stroke-width", 3);
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).style("fill", function() {
          return d3.rgb(d3.select(event.currentTarget).style("fill")).darker(-0.5);
        });
        d3.select(".tooltip").text("").style("opacity", 0);
        let path = d3.select(event.currentTarget)
        path.style("stroke", "#fff").style("stroke-width", 1);
      });


    svg.append("g").attr("transform", "translate(20,600)").call(legend);
  })
}

window.onload = function() {
  var loader = document.getElementById('loaderId')
  var close = document.getElementsByClassName('close-presentation')

  loader.classList.remove('loader--active')

  const Boxlayout = (() => {
    const wrapper = document.body,
      sections = [...document.querySelectorAll(".section")],
      closeButtons = [...document.querySelectorAll(".close-section")],
      expandedClass = "is-expanded",
      hasExpandedClass = "has-expanded-item";

    const initEvents = () => {
      sections.forEach((element) => {
        element.addEventListener("click", () => openSection(element));
      });
      closeButtons.forEach((element) => {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          closeSection(element.parentElement);
        });
      });
    };

    const openSection = (element) => {
      if (!element.classList.contains(expandedClass)) {
        element.classList.add(expandedClass);
        wrapper.classList.add(hasExpandedClass);
        element.querySelector(".demo-box").style.display = "none";
        element.querySelector(".demo-box-1").style.display = "block";
        close[0].style.display = "none";
      }
    };

    const closeSection = (element) => {
      if (element.classList.contains(expandedClass)) {
        element.classList.remove(expandedClass);
        wrapper.classList.remove(hasExpandedClass);
        element.querySelector(".demo-box").style.display = "flex";
        element.querySelector(".demo-box-1").style.display = "none";
        close[0].style.display = "block";
      }
    };

    return { init: initEvents };
  })();

  Boxlayout.init();


  drawGeo();

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  const line = document.getElementById('lineChart');

  const lineData = {
    labels: DAYS,
    datasets: [
      {
        label: 'Weekly / Daily Positive Cases',
        data: [120, 180, 200, 180, 150, 190, 250],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  };

  const lineChart = new Chart(line, {
    type: 'line',
    data: lineData,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Covid Cases'
        }
      }
    }
  });

  const bar = document.getElementById('barChart');

  const barData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Death',
        data: [1, 2, 0, 3, 5, 1, 2, 9, 3, 1, 5, 2],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2
      },
      {
        label: 'Hospitalised',
        data: [12, 24, 20, 8, 15, 19, 25, 29, 31, 25, 18, 20],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor:'rgba(54, 162, 235, 0.5)',
        borderWidth: 2
      },
      {
        label: 'ICU',
        data: [2, 4, 0, 8, 5, 9, 5, 2, 1, 2, 8, 2],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderWidth: 2
      }
    ]
  };

  const barChart = new Chart(bar, {
    type: 'bar',
    data: barData,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Covid Cases'
        }
      }
    }
  });

  const pie = document.getElementById('pieChart');

  const pieData = {
    labels: [
      'Unvaccinated',
      'Unvaccinated'
    ],
    datasets: [{
      label: 'Population with 1st Dose',
      data: [50, 300],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 10
    }]
  };

  const pieChart = new Chart(pie, {
    type: 'pie',
    data: pieData,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

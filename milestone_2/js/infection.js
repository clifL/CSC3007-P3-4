let width = 1200, height = 800;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

// Load external data
Promise.all([d3.csv("data/week-on-week-infection-ratio.csv")]).then(data => {
    date = []
    ratio = []
    data.forEach(element => {
        count = 0
        element.forEach(d => {
            if (count == 0 || count % 3 == 0) {
                date.push(d.pr_date)
                ratio.push(d.ratio_comm_cases_pw_over_wb)
            }
            count += 1
        })
    })
    const line = document.getElementById('lineChart');
    console.log(date)
    const lineData = {
        labels: date,
        datasets: [
            {
                label: 'Infection Ratio',
                data: ratio,
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
                    display: false
                },
                title: {
                    display: true,
                    text: 'Infection Ratio'
                }
            }
        }
    });
});
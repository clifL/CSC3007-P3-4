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
            maintainAspectRatio: true,
            scales: {
                xAxes: [{
                    ticks: {
                        display: true,
                        autoSkip: true,
                        maxTicksLimit: 3
                    }
                }]
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Infection Rate'
                }
            }
        },
    });
});
// Load external data
Promise.all([d3.csv("data/epidemic-curve.csv"), d3.csv("data/patients-needing-oxygen-supplementation-icu-care-or-died-by-age-groups.csv")]).then(data => {
    groupByMonth = d3.group(data[0], d => d.date.substring(6, 8));
    local = []
    imported = []
    groupByMonth.forEach(element => {
        local_sum = 0
        imported_sum = 0
        element.forEach(d => {
            if (d.type == 'Local') {
                local_sum += parseInt(d.value)
            } else {
                imported_sum += parseInt(d.value)
            }
        })
        local.push(local_sum)
        imported.push(imported_sum)
    })

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
        'October'
    ];

    const bar = document.getElementById('barChart');

    const barData = {
        labels: MONTHS,
        datasets: [
            {
                label: 'Local Case',
                data: local,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 2
            },
            {
                label: 'Imported Case',
                data: imported,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
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
});
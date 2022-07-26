Promise.all([d3.csv("data/epidemic-curve.csv"), d3.csv("data/patients-needing-oxygen-supplementation-icu-care-or-died-by-age-groups.csv")]).then(data => {
    const groupByAge = d3.group(data[1], d => d.age_groups);
    age_groups = []
    category = {}
    deceased = []
    hospitalised = []
    icu = []
    o2 = []

    groupByAge.forEach(element => {
        groupByCategory = d3.group(element, d => d.clinical_status);

        groupByCategory.forEach(element2 => {
            sum = 0
            element2.forEach(d2 => {
                if (!age_groups.includes(d2.age_groups)) {
                    age_groups.push(d2.age_groups)
                }
                key = d2.clinical_status
                sum += parseInt(d2.count_of_case)
                category[key] = sum
            })
        })
        deceased.push(category['Deceased (based on date of death)'])
        hospitalised.push(category['Hospitalised'])
        icu.push(category['ICU'])
        o2.push(category['Requires Oxygen Supplementation in General Ward'])
    })

    const bar = document.getElementById('barChart');

    const barData = {
        labels: age_groups,
        datasets: [
            {
                label: 'Deceased',
                data: deceased,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 2
            },
            {
                label: 'Hospitalised',
                data: hospitalised,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderWidth: 2
            },
            {
                label: 'ICU',
                data: icu,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderWidth: 2
            },
            {
                label: 'Require Oxygen Supplements',
                data: o2,
                borderColor: 'rgb(159, 43, 104)',
                backgroundColor: 'rgba(159, 43, 104, 0.5)',
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
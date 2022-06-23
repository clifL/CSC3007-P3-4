window.onload = function () {
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

    const line = document.getElementById('bicycleChart');

    const lineData = {
        labels: DAYS,
        datasets: [
            {
                label: 'Daily Bicycle Count',
                data: [3112, 2936, 2756, 3000, 3152, 2888, 2999],
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
                    text: 'Number of Bicycles'
                }
            }
        }
    });

    const TRENDS = [
        "Father's Day",
        "Luca",
        "Danica",
        "#CanadianGP",
        "#USOpen"
    ]

    const COUNTS = [
        1235677,
        1006854,
        981254,
        783943,
        533843
    ]

    const myTable = document.getElementById('data')

    let tab =
        `<tr>
                    <th>Ranking</th>
                    <th>Trend</th>
                    <th># of Mentions</th>
             `
    myTable.innerHTML = tab

    for (let i = 0; i < 5; i++) {
        var tr = myTable.insertRow(-1)
        var tabCell = tr.insertCell(-1)
        tabCell.innerHTML = i + 1

        var rowValue = TRENDS[i]
        var tabCell = tr.insertCell(-1)
        tabCell.innerHTML = rowValue

        var rowValue = COUNTS[i]
        var tabCell = tr.insertCell(-1)
        tabCell.innerHTML = rowValue
    }

    const pie = document.getElementById('pieChart');

    const pieData = {
        labels: [
            'Happy',
            'Unhappy',
            'Neutral'
        ],
        datasets: [{
            label: 'Population with 1st Dose',
            data: [6287400, 898200, 1796400],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(113, 87, 198)'
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
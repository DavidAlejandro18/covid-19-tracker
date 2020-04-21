var opcionesPaises = 'https://covid2019-api.herokuapp.com/v2/current';
var timeSerie = 'https://covid2019-api.herokuapp.com/v2/timeseries/confirmed';

// Obtener todo tipo de casos dependiendo del país
var selectPaises = document.getElementById('paises');
var selectProvincias = document.getElementById('provincias');
var btnBuscar = document.getElementById('buscar');

// Se agregan todos los paises al selectPaises para mostrar su información
fetch(opcionesPaises)
    .then(response => response.json())
    .then((data) => {
        data.data.map((localidad) => {
            let opcion = document.createElement("option");
            opcion.innerHTML = `${localidad.location}`;

            selectPaises.appendChild(opcion);
        });
    })
    .catch((err) => console.error(err));

// Se agregan todas las provincias dependiendo del país seleccionado
selectPaises.addEventListener("change", function () {
    let selectedOption = this.options[selectPaises.selectedIndex];

    // Se limpian todas las opciones del select de provincias
    while (selectProvincias.firstChild) {
        selectProvincias.removeChild(selectProvincias.firstChild);
    }

    btnBuscar.setAttribute("disabled", "");

    series()
        .then((data) => {
            data.data.map((paises) => {
                if (paises['Country/Region'] == selectedOption.text) {
                    if (paises['Province/State'] == "") {
                        // En caso de no tener provincias, se agrega el texto `No hay provincias` y se deshabilita el select
                        let opcion = document.createElement("option");
                        opcion.innerHTML = "";

                        selectProvincias.appendChild(opcion);

                        selectProvincias.setAttribute("disabled", "");

                        btnBuscar.removeAttribute("disabled");
                    } else {
                        // En caso de tener provincias, se agregan todas las provincias respectivas al país al select
                        let opcion = document.createElement("option");
                        opcion.innerHTML = `${paises['Province/State']}`;

                        selectProvincias.appendChild(opcion);

                        selectProvincias.removeAttribute("disabled");

                        btnBuscar.removeAttribute("disabled");
                    }
                }
            });
        })
        .catch((err) => console.error(err));
});

btnBuscar.addEventListener("click", function () {
    let selectedOptionPaises = selectPaises.options[selectPaises.selectedIndex];
    let selectedOptionProvincias = selectProvincias.options[selectProvincias.selectedIndex];
    let serieTiempo = [];
    let date = [];
    let value = [];

    series()
        .then((data) => {
            data.data.map((paises) => {
                if (paises["Country/Region"] == selectedOptionPaises.text) {
                    if (paises["Province/State"] == selectedOptionProvincias.text) {
                        //console.log(paises['TimeSeries']);
                        serieTiempo.push(paises['TimeSeries']);
                    }
                }
            })

            serieTiempo[0].map((valor) => {
                date.push(valor.date);
                value.push(valor.value);
            });
            //console.log(date);
            
            if (window.bar != undefined) {
                window.bar.destroy();
            }

            var ctx = document.getElementById('myChart').getContext('2d');
            window.bar = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: date,
                    datasets: [{
                        label: 'Número de contagios',
                        data: value,
                        backgroundColor: [
                            'rgba(44, 62, 80, 0.2)'
                        ],
                        borderColor: [
                            'rgba(28, 40, 51, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        })
        .catch((err) => console.error(err));
});

async function series() {
    const response = await fetch(timeSerie);
    return await response.json();
}

/* var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7', 'Dia 8', 'Dia 9', 'Dia 10', 'Dia 11', 'Dia 12', 'Dia 13', 'Dia 14', 'Dia 15', 'Dia 16', 'Dia 17', 'Dia 18', 'Dia 19', 'Dia 20', 'Dia 21', 'Dia 22', 'Dia 23', 'Dia 24', 'Dia 25', 'Dia 26', 'Dia 27', 'Dia 28', 'Dia 29', 'Dia 30', 'Dia 31'],
        datasets: [{
            label: 'Número de contagios',
            data: [1, 1, 3, 5, 7, 8, 10, 12, 19, 23, 45, 52, 53, 60, 72, 79, 83, 85, 92, 93, 100, 102, 105, 109, 120, 130, 175, 250, 302, 308, 398],
            backgroundColor: [
                'rgba(44, 62, 80, 0.2)'
            ],
            borderColor: [
                'rgba(28, 40, 51, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}); */
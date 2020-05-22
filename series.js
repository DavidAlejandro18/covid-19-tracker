var opcionesPaises = 'https://covid2019-api.herokuapp.com/v2/current';
var timeSerie = 'https://covid2019-api.herokuapp.com/v2/timeseries/confirmed';

// Obtener todo tipo de casos dependiendo del país
var selectPaises = document.getElementById('paises');
var selectProvincias = document.getElementById('provincias');
var btnBuscar = document.getElementById('buscar');

// Obtener el contenedor del preloader
var preloader = document.getElementById('preloader');

// Obtener el contenedor de la gráfica
var chart = document.getElementById('myChart');

var arrayPaises = [];

// Se agregan todos los paises al selectPaises para mostrar su información
fetch(opcionesPaises)
    .then(response => response.json())
    .then((data) => {
        data.data.map((localidad) => {
            arrayPaises.push(localidad.location);
        });

        // Ordena la lista de forma alfabetica
        arrayPaises.sort().map((localidadValor) => {
            let opcion = document.createElement("option");
            opcion.innerHTML = `${localidadValor}`;

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

    preloader.style.display = 'block';
    chart.style.display = 'none'

    series()
        .then((data) => {
            data.data.map((paises) => {
                if (paises["Country/Region"] == selectedOptionPaises.text) {
                    if (paises["Province/State"] == selectedOptionProvincias.text) {
                        serieTiempo.push(paises['TimeSeries']);
                    }
                }
            })

            serieTiempo[0].map((valor) => {
                date.push(valor.date);
                value.push(valor.value);
            });
            
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
                                beginAtZero: true,
                                callback: function (value) {
                                    return formatNumber(value)
                                }
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, chart){
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + ': ' + formatNumber(tooltipItem.yLabel);
                            }
                        }
                    }
                }
            });

            chart.style.display = 'block';
            preloader.style.display = 'none';
        })
        .catch((err) => console.error(err));
});

async function series() {
    const response = await fetch(timeSerie);
    return await response.json();
}

const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
var opcionesPaises = 'https://covid2019-api.herokuapp.com/v2/current';
var timeSerie = 'https://covid2019-api.herokuapp.com/v2/timeseries/confirmed';

// Obtener todo tipo de casos dependiendo del país
var selectPaises = document.getElementById('paises');
var selectProvincias = document.getElementById('provincias');
/* var containerProvincias = document.getElementById("containerProvincias");
var titleProvincia = document.getElementById('titleProvincia'); */

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

// Obtener las series de tiempo cuando esten cargadas


selectPaises.addEventListener("change", function() {
    let selectedOption = this.options[selectPaises.selectedIndex];
    
    while (selectProvincias.firstChild) {
        selectProvincias.removeChild(selectProvincias.firstChild);
    }

    series()
        .then((data) => {
            data.data.map((paises) => {
                if(paises['Country/Region'] == selectedOption.text) {
                    if (paises['Province/State'] == "") {
                        let opcion = document.createElement("option");
                        opcion.innerHTML = "No hay provincias disponibles";
                        
                        selectProvincias.appendChild(opcion);

                        selectProvincias.setAttribute("disabled", "");
                    } else {
                        let opcion = document.createElement("option");
                        opcion.innerHTML = `${paises['Province/State']}`;
                        
                        selectProvincias.appendChild(opcion);
                        
                        selectProvincias.removeAttribute("disabled");
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
        labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7', 'Dia 8', 'Dia 9', 'Dia 10', 'Dia 11', 'Dia 12', 'Dia 13', 'Dia 14', 'Dia 15', 'Dia 16', 'Dia 17', 'Dia 18', 'Dia 19', 'Dia 20', 'Dia 21'],
        datasets: [{
            label: 'Número de contagios',
            data: [1, 1, 3, 5, 7, 8, 10, 12, 19, 23, 45, 52, 53, 60, 72, 79, 83, 85, 92, 93, 100],
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
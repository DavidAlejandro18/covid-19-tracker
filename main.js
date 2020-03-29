var confirmados = 'https://covid2019-api.herokuapp.com/v2/confirmed';
var muertos = 'https://covid2019-api.herokuapp.com/v2/deaths';
var recuperados = 'https://covid2019-api.herokuapp.com/v2/recovered';
var activos = 'https://covid2019-api.herokuapp.com/v2/active';
var total = 'https://covid2019-api.herokuapp.com/v2/total';
var paises = 'https://covid2019-api.herokuapp.com/v2/country/';
var opcionesPaises = 'https://covid2019-api.herokuapp.com/v2/current';

// Casos confirmados
fetch(confirmados)
    .then((response) => response.json())
    .then((data) => {
        let datosConfirmados = document.getElementById('confirmados');
        datosConfirmados.innerHTML = `<span class = "badge badge-pill badge-danger"><i class="fas fa-biohazard"></i> ${formatNumber(data.data)}</span>`;
    })
    .catch((err) => console.log(err));

// Casos de defunciones
fetch(muertos)
    .then((response) => response.json())
    .then((data) => {
        let datosMuertos = document.getElementById('muertos');
        datosMuertos.innerHTML = `<span class = "badge badge-pill badge-secondary"><i class="fas fa-skull-crossbones"></i> ${formatNumber(data.data)}</span>`;
    })
    .catch((err) => console.log(err));

// Casos recuperados
fetch(recuperados)
    .then((response) => response.json())
    .then((data) => {
        let datosRecuperados = document.getElementById('recuperados');
        datosRecuperados.innerHTML = `<span class = "badge badge-pill badge-success"><i class="fas fa-syringe"></i> ${formatNumber(data.data)}</span>`
    })
    .catch((err) => console.log(err));

// Casos activos
fetch(activos)
    .then((response) => response.json())
    .then((data) => {
        let datosActivos = document.getElementById('activos');
        datosActivos.innerHTML = `<span class = "badge badge-pill badge-warning"><i class="fas fa-head-side-virus"></i> ${formatNumber(data.data)}</span>`;
    })
    .catch((err) => console.log(err));

// Obtener todo tipo de casos dependiendo del país
var select = document.getElementById('paises');

// Se agregan todos los paises al select para mostrar su información
fetch(opcionesPaises)
    .then((response) => response.json())
    .then((data) => {
        data.data.map((localidad) => {
            let opcion = document.createElement("option");
            let contenido = `${localidad.location}`;
            opcion.appendChild(document.createTextNode(contenido));
            select.appendChild(opcion);
        });
    })
    .catch((err) => console.log(err));

// Se crea un evento en el que se obtiene el dato del país que se haya seleccionado
select.addEventListener('change',
  function() {
    let selectedOption = this.options[select.selectedIndex];
    fetch(paises + selectedOption.text)
        .then((response) => response.json())
        .then((data) => {
            let resultBox = document.getElementById('resultado');
            resultBox.innerHTML = `
            <div class = "row">
                <div class = "col-sm mt-4">
                    <div class = "card shadow bg-white rounded">
                        <div class = "card-body">
                            <h5 class = "card-title">Total de casos confirmados</h5>
                            <h2 class = "card-text">
                                <span class = "badge badge-pill badge-danger"><i class="fas fa-biohazard"></i> ${formatNumber(data.data.confirmed)}</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div class = "col-sm mt-4">
                    <div class = "card shadow bg-white rounded">
                        <div class = "card-body">
                            <h5 class = "card-title">Total de casos fatales</h5>
                            <h2 class = "card-text">
                                <span class = "badge badge-pill badge-secondary"><i class="fas fa-skull-crossbones"></i> ${formatNumber(data.data.deaths)}</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class = "row mb-4">
                <div class = "col-sm mt-4">
                    <div class = "card shadow bg-white rounded">
                        <div class = "card-body">
                            <h5 class = "card-title">Total de casos recuperados</h5>
                            <h2 class = "card-text">
                                <span class = "badge badge-pill badge-success"><i class="fas fa-syringe"></i> ${formatNumber(data.data.recovered)}</span>
                            </h2>
                        </div>
                    </div>
                </div>
                <div class = "col-sm mt-4">
                    <div class = "card shadow bg-white rounded">
                        <div class = "card-body">
                            <h5 class = "card-title">Total de casos activos</h5>
                            <h2 class = "card-text">
                                <span class = "badge badge-pill badge-warning"><i class="fas fa-head-side-virus"></i> ${formatNumber(data.data.active)}</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            `;
        })
        .catch((err) => console.log(err));
  });

// Functions
// Función para dar formato a los numeros

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
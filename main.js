var total = 'https://covid2019-api.herokuapp.com/v2/total';
var paises = 'https://covid2019-api.herokuapp.com/v2/country/';
var opcionesPaises = 'https://covid2019-api.herokuapp.com/v2/current';
// Posible nueva API
// https://covid19-info.app/api/
// devuelve: {"lastUpdate":"2020-04-04T02:23:22.000Z","confirmed":{"value":1099389},"recovered":{"value":226603},"deaths":{"value":58901}}
// https://covid19-info.app/api/confirmed?level=countryRegion
// devuelve toda la informacion de todos los pasies [país, actualizacion, lat, long, confirmados, muertos, recuperados, activos, ...]

// Total de casos
casosTotales()
    .then((data) => {
        // Se obtienen e imprimen los casos confirmados y la fecha de actualización
        let datosConfirmados = document.getElementById('confirmados');
        let actualizacion = document.getElementById('update');
        actualizacion.innerHTML = `Fecha: ${data.dt}`;
        datosConfirmados.innerHTML = `<span class = "badge badge-pill badge-danger"><i class="fas fa-biohazard"></i> ${formatNumber(data.data.confirmed)}</span>`;

        // Se obtienen e imprimen los casos de defunciones
        let datosMuertos = document.getElementById('muertos');
        datosMuertos.innerHTML = `<span class = "badge badge-pill badge-secondary"><i class="fas fa-skull-crossbones"></i> ${formatNumber(data.data.deaths)}</span>`;

        // Se obtienen e imprimen los casos de recuperados
        let datosRecuperados = document.getElementById('recuperados');
        datosRecuperados.innerHTML = `<span class = "badge badge-pill badge-success"><i class="fas fa-syringe"></i> ${formatNumber(data.data.recovered)}</span>`;

        // Se obtienen e imprimen los casos activos
        let datosActivos = document.getElementById('activos');
        datosActivos.innerHTML = `<span class = "badge badge-pill badge-warning"><i class="fas fa-head-side-virus"></i> ${formatNumber(data.data.active)}</span>`;
    })
    .catch((err) => console.error(err));

async function casosTotales() {
    const response = await fetch(total);
    return await response.json();
}

// Se crea el ranking de cada país
var lista = document.getElementById('ranking');
rankingList()
    .then((data) => {
        data.data.map((valor) => {
            let item = document.createElement("li");
            item.className += "list-group-item d-flex justify-content-between align-items-center lista";
            item.innerHTML = `${valor.location} <span class = "badge badge-danger badge-pill">${formatNumber(valor.confirmed)}</span>`;

            lista.appendChild(item);
        })
    })
    .catch((err) => console.error(err));

async function rankingList() {
    const response = await fetch(opcionesPaises);
    return await response.json();
}

// Obtener todo tipo de casos dependiendo del país
var select = document.getElementById('paises');

// Se agregan todos los paises al select para mostrar su información
listaPaises()
    .then((data) => {
        data.data.map((localidad) => {
            let opcion = document.createElement("option");
            opcion.innerHTML = `${localidad.location}`;

            select.appendChild(opcion);
        });
    })
    .catch((err) => console.error(err));

async function listaPaises() {
    const response = await fetch(opcionesPaises);
    return await response.json();
}

// Se crea un evento en el que se obtiene el dato del país que se haya seleccionado
select.addEventListener('change',
  function() {
    let selectedOption = this.options[select.selectedIndex];
    datosPaises()
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
        .catch((err) => console.error(err));
    
    async function datosPaises() {
        const response = await fetch(paises + selectedOption.text);
        return await response.json();
    }
  });

// Functions
// Función para dar formato a los numeros

const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
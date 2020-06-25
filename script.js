let seleccionada = null;
let puestosTotales = 0;
let totales = document.getElementById("puestosTotales");
let tabla = document.getElementById("tabla");
let mapa = document.getElementById("mapid");
let mensake = document.getElementById("mensaje");

if(seleccionada == null){
    mensaje.innerHTML= "Selecciona una provincia para continuar";
}



let pro = document.getElementsByClassName('provincia');
for (let i = 0; i < pro.length; i++) {
    pro[i].addEventListener('click', imprimir);
}


function imprimir(evt) {
    let ajax = new XMLHttpRequest;
    ajax.open("GET", "./recarga.xml");
    ajax.send();
    ajax.addEventListener("readystatechange", tratamientoPeticion);
    let pulsado = evt.target;
    seleccionada = pulsado.id;
    puestosTotales = 0;
}


function getProvincia(codigoPostal) {
    let provincia = null;
    codigoPostal = String(codigoPostal);
    let inicioCP = codigoPostal.substring(0, 2);
    if (inicioCP == 47) {
        provincia = "Valladolid";
    } else if (inicioCP == 49) {
        provincia = "Zamora";
    } else if (inicioCP == 42) {
        provincia = "Soria";
    } else if (inicioCP == 05) {
        provincia = "Avila";
    } else if (inicioCP == 09) {
        provincia = "Burgos";
    } else if (inicioCP == 24) {
        provincia = "Leon";
    } else if (inicioCP == 37) {
        provincia = "Salamanca";
    } else if (inicioCP == 34) {
        provincia = "Palencia";
    } else if (inicioCP == 40) {
        provincia = "Segovia";
    }
    return provincia;

}


function tratamientoPeticion() {
    if (this.readyState === 4 && this.status === 200) {
        let documentoXML = this.responseXML;
        tratarDatos(documentoXML);
    } else if (this.status == 404) {
        tabla.innerHTML = "<img src='error.gif' alt='ajax'>";
    } else if (this.status == 500) {
        tabla.innerHTML = "<img src='error500.gif' alt='ajax'>";
    } else if (this.readyState == 2) {
        tabla.innerHTML = "<img src='ajax_loading.gif' alt='ajax'>";
        console.log("Cargando");
    }
}

let mymap = L.map('mapid');

function vermapa() {
    if(seleccionada == null){
        mensaje.innerHTML= "Selecciona una provincia para continuar";
    }else{
        mensaje.innerHTML= "";
    }

    switch (seleccionada) {
        case "Salamanca":
            latitud = 40.9700;
            longitud = -5.6310;
            break;
        case "Segovia":
            latitud = 40.9467;
            longitud = -4.1097;
            break;
        case "Valladolid":
            latitud = 41.6566;
            longitud = -4.7162;
            break;
        case "Zamora":
            latitud = 41.5109;
            longitud = -5.7052;
            break;
        case "Soria":
            latitud = 41.7704;
            longitud = -2.4718;
            break;
        case "Avila":
            latitud = 40.6554;
            longitud = -4.6904;
            break;
        case "Burgos":
            latitud = 42.3479;
            longitud = -3.6878;
            break;
        case "Leon":
            latitud = 42.6018;
            longitud = -5.5623;
            break;
        case "Palencia":
            latitud = 42.0119;
            longitud = -4.5186;
            break;
    }

    mymap.setView([latitud, longitud], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
}


function addIconno(latitud, longitud) {
    let icono = L.icon({
        iconUrl: './icono.png',
        iconSize: [38, 38], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([latitud, longitud], {
        icon: icono
    }).addTo(mymap);

    vermapa();

}


function tratarDatos(docXML) {
    let contenedor = document.getElementById("tabla");
    let cadena = `<table><tr><th>Calle</th><th>Provincia</th><th>Codigo Postal</th><th>Enlace</th><th>Datos del propietario</th><th> Localidad </th><th> Cantidad </th></tr>`;

    for (let fila of docXML.getElementsByTagName("row")) {
        for (let datos of fila.getElementsByTagName("fields")) {
            let calle = datos.querySelector("calle");
            let enlace = datos.querySelector("enlace_al_contenido").textContent;
            let datosPersonales = datos.querySelector("datospersonales");
            let cantidad = datos.querySelector("nombre_del_organismo").textContent;
            let latitud = datos.querySelector("latitud").textContent;
            let longitud = datos.querySelector("longitud").textContent;
            latitudGlobal = latitud;
            longitudGlobal = longitud;
            let c = cantidad.substring(0, 1);
            let localidad = datos.querySelector("localidad");
            let cp = datos.querySelector("codigopostal");
            cp = cp.textContent;
            let provincia = getProvincia(cp);
            c = parseInt(c);




            if (datosPersonales == null) {
                datosPersonales = "Indefinidos";
            }
            if (localidad == null) {
                localidad = "indefinida";
            }
            if (isNaN(c)) {
                c = 1;
            }


            
            if (provincia == "Salamanca" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Salamanca </td> <td> ${cp} </td> <td> <a href="${enlace}">Enlace</a>  </td> <td> ${datosPersonales.textContent}  </td> <td> ${localidad.textContent} </td> <td>${c}</td> </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Segovia" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Segovia </td><td> ${cp} </td> <td> <a href="${enlace}">Enlace</a>  </td>  <td> ${datosPersonales.textContent}  </td>   <td> ${localidad.textContent} </td> <td>${c}</td>  </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Valladolid" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Valladolid </td> <td> ${cp} </td><td> <a href="${enlace}">Enlace</a>  </td>   <td> ${datosPersonales.textContent}  </td><td> ${localidad.textContent} </td> <td>${c}</td>  </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;



            } else if (provincia == "Zamora" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Zamora </td><td> ${cp} </td> <td> <a href="${enlace}">Enlace</a>  </td>  <td> ${datosPersonales.textContent}  </td> <td> ${localidad.textContent} </td> <td>${c}</td>   </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Soria" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Soria </td> <td> ${cp} </td> <td> <a href="${enlace}">Enlace</a>  </td>  <td> ${datosPersonales.textContent}  </td> <td> ${localidad.textContent} </td> <td>${c}</td>  </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Avila" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Avila </td> <td> ${cp} </td>  <td> <a href="${enlace}">Enlace</a>  </td>  <td> ${datosPersonales.textContent}  </td> <td> ${localidad.textContent} </td> <td>${c}</td> </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Burgos" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Burgos </td> <td> ${cp} </td>  <td> <a href="${enlace}">Enlace</a>  </td>  <td> ${datosPersonales.textContent}  </td><td> ${localidad.textContent} </td> <td>${c}</td>  </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Leon" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> León </td> <td> ${cp} </td> <td> <a href="${enlace}">Enlace</a>  </td>  <td> ${datosPersonales.textContent}  </td><td> ${localidad.textContent} </td> <td>${c}</td>   </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;


            } else if (provincia == "Palencia" && seleccionada == provincia) {
                cadena += `<tr> <td> ${calle.textContent} </td><td> Palencia </td> <td> ${cp} </td> <td> <a href="${enlace}">Enlace</a>  </td> <td> ${datosPersonales.textContent}  </td> <td> ${localidad.textContent} </td> <td>${c}</td>   </tr>`;
                puestosTotales = puestosTotales + c;
                totales.innerHTML = `${seleccionada} tiene un total de ${puestosTotales} cargadores disponibles`;

            } else {
                break;
            }
            addIconno(latitudGlobal, longitudGlobal);
        }

    }
    cadena += "</table>";
    contenedor.innerHTML = cadena;
    

}
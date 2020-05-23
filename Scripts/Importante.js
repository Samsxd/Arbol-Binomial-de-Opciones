// campos a ocultar para el formulario de blacksholes
const camposBlackSholes = ["pasos-div", "u_d-div", "opcion-div"];
// campos a ocultar para las graficas
const camposOcultosGrafica = ["pasos-div", "u_d-div", "opcion-div", "spot-div", "strike-div",
  "t-div", "pasos-div", "tasa-div", "volatilidad-div", "opcion-div", "posicion-div"];

const camposGraficas = ["spot-div", "strike-div",];

// objeto que permite crear alertas con botones personalizados
const alertaPerzonalizada = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true
});

// permite habilitar los campos necesarios según el menu de carga
function HabilitarFormulario() {
  let formulario = Operaciones.ObtenerParametro();
  if (formulario == "") {
    Validaciones.OcultarCampo("contenedor");
    return;
  }
  document.getElementById(formulario).classList.add("active");

  if (formulario === "bs") {
    camposBlackSholes.forEach(campo => {
      Validaciones.OcultarCampo(campo);
    });
  } else if (formulario === "gfcs") {
    document.getElementById("graficas-div").style.display = "flex";
    document.getElementById("graficador-div").style.display = "flex";
    document.getElementById("grafica").value = "0";
    camposOcultosGrafica.forEach(campo => {
      Validaciones.OcultarCampo(campo);
    });
  }
};

// Realiza el cambio de grafica de acuerdo al tipo de grafica que se desea ver
function CambioDeGrafica() {
  let selectGrafica = document.getElementById("grafica");
  //Permite habilitar los campos necesarios para el tipo de grafica ingresada
  switch (selectGrafica.selectedIndex) {
    //spot y strike para opciones y activo subyacente (trading con opciones y subyacente)
    case 1:
    case 2:
    case 3:
    case 4:
      camposGraficas.forEach(campo => {
        Validaciones.MostrarCampo(campo);
      });
      Validaciones.OcultarCampo("grafica-spreads-combi");
      Validaciones.OcultarCampo("lineaMariposa");
      Validaciones.BorrarNombres();
      Validaciones.OcultarCampo("graficas-label");
      break;
    //Spot y strike x2 para spreads y combinaciones 
    case 5:
    case 6:
    case 7:
    case 8:
    case 11:
    case 12:
    case 13:
    case 14:
      camposGraficas.forEach(campo => {
        Validaciones.OcultarCampo(campo);
      });
      Validaciones.MostrarCampo("grafica-spreads-combi", "block");
      Validaciones.OcultarCampo("strike mariposa");
      Validaciones.OcultarCampo("lineaMariposa");
      Validaciones.BorrarNombres();
      Validaciones.OcultarCampo("graficas-label");
      break;
    //Spot y strike x3 para mariposas 
    case 9:
    case 10:
      camposGraficas.forEach(campo => {
        Validaciones.OcultarCampo(campo);
      });
      Validaciones.MostrarCampo("grafica-spreads-combi", "block");
      Validaciones.MostrarCampo("strike mariposa");
      Validaciones.MostrarCampo("lineaMariposa");
      Validaciones.BorrarNombres();
      Validaciones.OcultarCampo("graficas-label");
      break;
    default:
      camposGraficas.forEach(campo => {
        Validaciones.OcultarCampo(campo);
      });
      Validaciones.OcultarCampo("grafica-spreads-combi");
      Validaciones.OcultarCampo("lineaMariposa");
      Validaciones.OcultarCampo("graficas-label");
      Validaciones.BorrarNombres();
      break;
  }
};

// Funcion que esta ligada a los botones 
function Calcular() {
  let parametros = new Object();
  let decimal = 10000; //precisión de los números decimales de los parametros de entrada.

  let mensaje = "";
  let formulario = Operaciones.ObtenerParametro();
  // validar los campos del formulario, confirma que los campos fueron llenado scon exito
  switch (formulario) {
    case "rbl":
      mensaje = Validaciones.ValidarFormluarioArbol(parametros, decimal);
      break;
    case "bs":
      mensaje = Validaciones.ValidarFormluarioBlackSholes(parametros, decimal);
      break;
    case "gfcs":
      let selectGrafica = document.getElementById("grafica");
      //Selecciona las graficas trading con opciones y subyacente
      if (selectGrafica.selectedIndex === 0)
        mensaje = "Escoge al menos un tipo de grafica"
      else if (selectGrafica.selectedIndex > 0 && selectGrafica.selectedIndex < 5)
        mensaje = Validaciones.ValidarFormluarioGraficasSyK(parametros, decimal);
      //Selecciona las graficas para las mariposas
      else if (selectGrafica.selectedIndex > 8 && selectGrafica.selectedIndex < 11)
        mensaje = Validaciones.ValidarFormluarioGraficasMariposas(parametros, decimal);
      // selecciona las graficas para las combinaciones
      else
        mensaje = Validaciones.ValidarFormluarioGraficasSpreadsCombi(parametros, decimal);

      break;
    default:
      mensaje = "Formulurio no implementado";
      break;
  }

  /*si el mensaje esta vacio significa que el formulario fue correctamente diligenciado*/
  if (mensaje == "") {

    switch (formulario) {
      case "rbl":
        GenerarAlertaExitoArbol(parametros);
        break;
      case "bs":
        GenerarAlertaExitoBlackSholes(parametros);
        break;
      case "gfcs":
        GenerarAlertaExitoGraficas(parametros);
        break;
      default:
        break;
    }
  }
  else
    GenerarAlertaError(mensaje);

  Validaciones.OcultarCampo("prima");
};

// alerta con el mensaje de error 
function GenerarAlertaError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Cancelado ',
    text: 'Los campos estan mal digilenciados!',
    footer: mensaje
  });
};

// alerta para los nodos del árbol
function GenerarAlertaArbol(mensaje) {
  Swal.fire({
    icon: 'success',
    title: 'Resultados ',
    text: mensaje,
    footer: ""
  });
};

// alerta para las graficas
function GenerarAlertaExitoGraficas(parametros) {
  let vectores = {};
  //Mensaje para generar o no el arbol, mensaje que recuerda como deben ser los parametros a ingresar
  crearVectoresGraficas(parametros, document.getElementById("grafica").selectedIndex, vectores);
  alertaPerzonalizada.fire({
    title: '¿Estas seguro?',
    text: vectores.mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
    //Mensaje si se quiere genera la grafica
  }).then((result) => {
    if (result.value) {
      alertaPerzonalizada.fire(
        'Generado! (>w<)',
        'Tus datos han sido procesados',
        'success'
      )
      //Aqui escoge que vectores de grafica tomar
      if (vectores.mariposa)
        GenerarGraficaMariposa(vectores);
      else
        GenerarGrafica(vectores);
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      //Mensaje si no se genera la grafica
      alertaPerzonalizada.fire(
        'Cancelado!',
        'Tus datos no serán procesados :(',
        'error'
      )
    }
  });
};

//alerta para blacksholes
function GenerarAlertaExitoBlackSholes(parametros) {

  alertaPerzonalizada.fire({
    title: '¿Estas seguro?',
    text: "Se van a generar los datos",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
  }).then((result) => {

    if (result.value) {
      CalcularBlackSholes(parametros);
      alertaPerzonalizada.fire(
        'Generado! (>w<)',
        `ok`,
        'success'
      )
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      document.getElementById("tablita").innerHTML = "";
      Validaciones.OcultarCampo("prima");

      swalWithBootstrapButtons.fire(
        'Cancelado!',
        'Tus datos no serán procesados :(',
        'error'
      )
    }
  });
};

//alerta para el arbol
function GenerarAlertaExitoArbol(parametros) {
  //Mensaje de alerta para generar o no el arbol
  alertaPerzonalizada.fire({
    title: '¿Estas seguro?',
    text: "Se va a generar el Arbolito",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
    //Mensaje si es generado el arbol
  }).then((result) => {
    if (result.value) {
      alertaPerzonalizada.fire(
        'Generado! (>w<)',
        'Tus datos han sido procesados',
        'success'
      )
      //Mensaje si no se genera el arbol, reinicia el formulario, borra la tabla y oculta la prima
      GenerarArbol(parametros);
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      let tablita = document.getElementById("tablita");
      tablita.innerHTML = "";
      Validaciones.OcultarCampo("prima");
      alertaPerzonalizada.fire(
        'Cancelado!',
        'Tus datos no serán procesados :(',
        'error'
      )
    }
  });
};

// funcion que genera el arbol
function GenerarArbol(parametros) {
  //Parametros necesarios para facilitar el calculo de las primas y demas cosas xD
  parametros.deltaT = (parametros.T / parametros.pasos) / 12;
  parametros.i = Math.exp(-(parametros.tasa / 100) * parametros.deltaT);
  parametros.ProbabilidadAlza = ((Math.exp((parametros.tasa / 100) * parametros.deltaT) - parametros.d) / (parametros.u - parametros.d));
  parametros.ProbabilidadBaja = 1 - parametros.ProbabilidadAlza;

  const matrixGrafica = new Array();
  const matrixSpots = new Array();
  Operaciones.crearMatriz(parametros, matrixGrafica);
  Operaciones.CrearEstructura(parametros, matrixGrafica);
  Operaciones.CalcularSpots(matrixSpots, parametros);
  const matrixPrimas = new Array(parametros.middle);
  //Si la opcion es europea entra aqui y se dirige a calcularPrimaEuropea (Operaciones.js)
  if (parametros.opcion === "Europea")
    Operaciones.CalcularPrimaEuropea(matrixSpots, matrixPrimas, parametros);
  //se dirige a calcularPrimaAmericana (Operaciones.js)
  else
    Operaciones.CalcularPrimaAmericana(matrixSpots, matrixPrimas, parametros);

  let contador = 0;
  let tablita = document.getElementById("tablita");
  tablita.innerHTML = "";
  // recorrer la matriz para pintarla 
  for (let i = 0; i < matrixGrafica.length; i++) {
    let fila = tablita.insertRow();
    fila.style.width = "40px";
    fila.style.height = "40px";
    let filaMatriz = matrixGrafica[i];
    let filaSpot = matrixSpots[i];
    let filaPrima = matrixPrimas[i];
    // recorro cada fila de la matriz
    for (let j = 0; j < filaMatriz.length; j++) {
      let columna = fila.insertCell();
      columna.style.width = "40px";
      columna.style.height = "40px";
      columna.style.padding = "1px";
      // si es 1 es un nodo del árbol
      if (filaMatriz[j] === 1) {
        // se inserta codigo HTML con el nodo y el evento click con los valores de cada nodo
        columna.innerHTML = `<div>
        <button class="res-circle" 
        onclick="GenerarAlertaArbol('S:${filaSpot[contador].toFixed(4)} F:${filaPrima[contador].toFixed(4)}');">
        </button>
        </div>`;
        contador++;
      };

    };
    contador = 0;
  };
  // habilitar el campo con el valor de la prima(F) en la pantalla principal
  let prima = document.getElementById("prima");
  let temp = matrixPrimas[0];
  prima.innerText = `Prima(F): ${temp[0].toFixed(4)}`;
  prima.style.display = "block";
};

// funcion que calcula BlackSholes
function CalcularBlackSholes(parametros) {
  //Calculo de los parametros adicionales a partir de los ingresados por el usuario
  let p1 = Math.log(parametros.spot / parametros.strike);
  let p2 = (parametros.tasa / 100) + ((parametros.volatilidad / 100) ** 2) / 2;
  let p3 = (parametros.volatilidad / 100) * Math.sqrt(parametros.T / 12);
  parametros.deltaT = (parametros.T) / 12;
  parametros.i = Math.exp(-(parametros.tasa / 100) * parametros.deltaT);
  parametros.d1 = (p1 + p2 * parametros.T / 12) / p3;
  parametros.d2 = parametros.d1 - p3;
  parametros.Nd1 = jStat.normal.cdf(parametros.d1, 0, 1);
  parametros.Nd2 = jStat.normal.cdf(parametros.d2, 0, 1);
  parametros.Nmenosd1 = 1 - parametros.Nd1;
  parametros.Nmenosd2 = 1 - parametros.Nd2;
  parametros.call = parametros.spot * parametros.Nd1 - parametros.strike * parametros.i * parametros.Nd2;
  parametros.put = parametros.strike * parametros.i * parametros.Nmenosd2 - parametros.spot * parametros.Nmenosd1;

  //muestra el resultado de la opcion, call o put
  if (parametros.pos.includes("Call")) {
    Validaciones.MostrarAgregarCampo("put-call", `call: ${parametros.call.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("d1", `d1: ${parametros.d1.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("d2", `d2: ${parametros.d2.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("Nd1", `N(d1): ${parametros.Nd1.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("Nd2", `N(d2): ${parametros.Nd2.toFixed(4)}`);
  }
  else {
    Validaciones.MostrarAgregarCampo("put-call", `put: ${parametros.put.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("d1", `-d1: ${-1 * parametros.d1.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("d2", `-d2: ${-1 * parametros.d2.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("Nd1", `N(-d1): ${parametros.Nmenosd1.toFixed(4)}`);
    Validaciones.MostrarAgregarCampo("Nd2", `N(-d2): ${parametros.Nmenosd2.toFixed(4)}`);
  }
};

//Genera la grafica, estan las series (pendiente, pyg, suma) 
function GenerarGrafica(vectores) {

  new Chartist.Line('.ct-chart', {
    series: [{
      name: 'series-1',
      data: vectores.pendiente,
    }, {
      name: 'series-2',
      data: vectores.pyg,
    }, {
      name: 'series-3',
      data: vectores.suma
    }]
  },
    {
      axisX: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true

      },
      axisY: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true,
      }
    },
    {
      fullWidth: true,
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        }
      }
    }, [
    ['screen and (max-width: 500px)', {
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        }
      }
    }]
  ]);

};

//Genera la grafica, estan las series (pendiente, pyg, suma) para mariposas
function GenerarGraficaMariposa(vectores) {

  new Chartist.Line('.ct-chart', {
    series: [{
      name: 'series-1',
      data: vectores.pendiente,
    }, {
      name: 'series-2',
      data: vectores.pyg,
    }, {
      name: 'series-3',
      data: vectores.suma
    },
    {
      name: 'series-4',
      data: vectores.mariposa
    }]
  },
    {
      axisX: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true
      },
      axisY: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true
      }
    },
    {
      fullWidth: true,
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },
        'series-4': {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        }
      }
    }, [
    ['screen and (max-width: 500px)', {
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.step(),
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.step(),
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.step(),
        },
        'series-4': {
          lineSmooth: Chartist.Interpolation.step(),
        }
      }
    }]
  ]);

};
//Crea los vectores de las graficas
function crearVectoresGraficas(parametros, selectGrafica, vectores) {
  switch (selectGrafica) {
    case 1://Writing a coverage call
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pendiente = Operaciones.CalcularPendiente(vectores.base, parametros);
      vectores.pyg = Operaciones.CalcularPygCortoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El spot debe ser mayor al strike";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo subyacente", "Corto call", "Writing a coverage call");
      break;
    case 2://Reverse of a writing coverage
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pendiente = Operaciones.CalcularPendienteInversa(vectores.base);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike debe ser mayor al spot";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Corto subyacente", "Largo call", "Reverse of a writing coverage");
      break;
    case 3://Protective put strategy
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pendiente = Operaciones.CalcularPendiente(vectores.base);
      vectores.pyg = Operaciones.CalcularPygLargoPut(vectores.base, parametros, parametros.strike1 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El spot debe ser mayor al strike";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo subyacente", "Largo put", "Protective put strategy");
      break;
    case 4://Reverse of a protective put
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pendiente = Operaciones.CalcularPendienteInversa(vectores.base);
      vectores.pyg = Operaciones.CalcularPygCortoPut(vectores.base, parametros, parametros.strike1 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike debe ser mayor al spot";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Corto subyacente", "Corto put", "Reverse of a protective put");
      break;
    case 5://Bull spread call
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.pendiente = Operaciones.CalcularPygCortoCallBullS(vectores.base, parametros, parametros.spot - parametros.strike2);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 2 debe ser mayor al  strike 1";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo call", "Corto call", "Bull spread call");
      break;
    case 6://Bull spread put
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pyg = Operaciones.CalcularPygLargoPut(vectores.base, parametros, parametros.strike1 - parametros.spot);
      vectores.pendiente = Operaciones.CalcularPygCortoPutBullS(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 2 debe ser mayor al  strike 1";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo put", "Corto put", "Bull spread put");
      break;
    case 7://Bear spread call
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.pendiente = Operaciones.CalcularPygCortoCallBullS(vectores.base, parametros, parametros.spot - parametros.strike2);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 2 debe ser mayor al  strike 1";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo call", "Corto call", "Bear spread call");
      break;
    case 8://Bear spread put
      vectores.base = Operaciones.CalcularBase(parametros, 20.00);
      vectores.pyg = Operaciones.CalcularPygLargoPut(vectores.base, parametros, parametros.strike1 - parametros.spot);
      vectores.pendiente = Operaciones.CalcularPygCortoPutBullS(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 2 debe ser mayor al  strike 1";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo put", "Corto put", "Bear spread put");
      break;
    case 11://Straddles
      vectores.base = Operaciones.CalcularBase(parametros, parametros.strike1);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.pendiente = Operaciones.CalcularPygLargoPutCombi(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 1 debe ser igual al  strike 2";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo call", "Largo put", "Straddles");
      break;
    case 12://Strips
      vectores.base = Operaciones.CalcularBase(parametros, parametros.strike1);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.pendiente = Operaciones.CalcularPygLargoPutCombi2(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 1 debe ser igual al  strike 2";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo call", "2 Largo put", "Strips");
      break;
    case 13://Straps
      vectores.base = Operaciones.CalcularBase(parametros, parametros.strike1);
      vectores.pyg = Operaciones.CalcularPygLargoCallCombi(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.pendiente = Operaciones.CalcularPygLargoPutCombi(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 1 debe ser igual al  strike 2";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("2 Largo call", "Largo put", "Straps");
      break;
    case 14://Strangles
      vectores.base = Operaciones.CalcularBase(parametros, parametros.strike1);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.pendiente = Operaciones.CalcularPygLargoPutCombi(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.suma = Operaciones.SumarVectores(vectores.pendiente, vectores.pyg);
      vectores.mensaje = "Recuerda: El strike 1 debe ser mayor al  strike 2";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("Largo call", "Largo put", "Strangles");
      break;
    case 9://Butterfly spread call
      vectores.base = Operaciones.CalcularBase(parametros, parametros.strike3);
      vectores.pendiente = Operaciones.CalcularPygCortoCallMariposa(vectores.base, parametros, parametros.spot - parametros.strike2);
      vectores.pyg = Operaciones.CalcularPygLargoCall(vectores.base, parametros, parametros.spot - parametros.strike1);
      vectores.mariposa = Operaciones.CalcularPygLargoCallMariposa(vectores.base, parametros, parametros.spot - parametros.strike3);
      vectores.suma = Operaciones.SumarVectoresMariposa(vectores.pendiente, vectores.pyg, vectores.mariposa);
      vectores.mensaje = "Recuerda: strike 1 < strike 2 < strike 3";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("2 Corto call", "Largo call a k1", "Butterfly spread call", "Largo call a k3");
      break;
    case 10://Butterfly spread put
      vectores.base = Operaciones.CalcularBase(parametros, parametros.strike3);
      vectores.pendiente = Operaciones.CalcularPygCortoPutMariposa(vectores.base, parametros, parametros.strike2 - parametros.spot);
      vectores.pyg = Operaciones.CalcularPygLargoPut(vectores.base, parametros, parametros.strike1 - parametros.spot);
      vectores.mariposa = Operaciones.CalcularPygLargoPutMariposa(vectores.base, parametros, parametros.strike3 - parametros.spot);
      vectores.suma = Operaciones.SumarVectoresMariposa(vectores.pendiente, vectores.pyg, vectores.mariposa);
      vectores.mensaje = "Recuerda: strike 1 < strike 2 < strike 3";
      Validaciones.MostrarCampo("graficas-label", "block");
      Validaciones.MostrarNombreColor("2 Corto put", "Largo put a k1", "Butterfly spread put", "Largo put a k3");
      break;
  }
}
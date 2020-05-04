// campos a ocultar para el formulario de blacksoles
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
    camposOcultosGrafica.forEach(campo => {
      Validaciones.OcultarCampo(campo);
    });
  }
}

function CambioDeGrafica() {
  let selectGrafica = document.getElementById("grafica");
  let opcion = selectGrafica.options[selectGrafica.selectedIndex].text;

  if (opcion === "Seleccionar...")
    return;

  camposGraficas.forEach(campo => {
    Validaciones.MostrarCampo(campo);
  });

}

/**
 * funcion que esta ligada a los botones 
 */
function Calcular() {
  let parametros = new Object();
  let decimal = 10000; //precisión de los números decimales de los parametros de entrada.

  /* los llamados parametros. es donde se guarda el valor, se divide por el decimal para obtener 
  4 cifras decimales maximas en el ingreso de los parametros por parte del usuario.
  mensaje, es la alerta que sale en pantalla si el usuario ingresa mal el parametro */

  let mensaje = "";
  let formulario = Operaciones.ObtenerParametro();
  // validar los campos del formulario
  switch (formulario) {
    case "rbl":
      mensaje = Validaciones.ValidarFormluarioArbol(parametros, decimal);
      break;
    case "bs":
      mensaje = Validaciones.ValidarFormluarioBlackSholes(parametros, decimal);
      break;
    case "gfcs":
      mensaje = Validaciones.ValidarFormluarioGraficas(parametros, decimal);
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
        GenerarGrafica(parametros);
        break;
      default:
        break;
    }
  }
  else
    GenerarAlertaError(mensaje);

  Validaciones.OcultarCampo("prima");
}

// alerta con el mensaje de error 
function GenerarAlertaError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Cancelado ',
    text: 'Los campos estan mal digilenciados!',
    footer: mensaje
  });
}

// alerta para los nodos del árbol
function GenerarAlertaArbol(mensaje) {
  Swal.fire({
    icon: 'success',
    title: 'Resultados ',
    text: mensaje,
    footer: ""
  });
}

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
}

function GenerarAlertaExitoArbol(parametros) {

  alertaPerzonalizada.fire({
    title: '¿Estas seguro?',
    text: "Se va a generar el Arbolito",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true

  }).then((result) => {
    if (result.value) {
      alertaPerzonalizada.fire(
        'Generado! (>w<)',
        'Tus datos han sido procesados',
        'success'
      )
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
}

//
function GenerarArbol(parametros) {
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

  if (parametros.opcion === "Europea")
    Operaciones.CalcularPrimaEuropea(matrixSpots, matrixPrimas, parametros);
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
    // recorro cada fila
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
      }

    }
    contador = 0;
  }
  // habilitar el campo con el valor de la prima(F)
  let prima = document.getElementById("prima");
  let temp = matrixPrimas[0];
  prima.innerText = `Prima(F): ${temp[0].toFixed(4)}`;
  prima.style.display = "block";
}


// 
function CalcularBlackSholes(parametros) {
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

  Validaciones.MostrarAgregarCampo("d1", `d1: ${parametros.d1.toFixed(4)}`);
  Validaciones.MostrarAgregarCampo("d2", `d2: ${parametros.d2.toFixed(4)}`);

  if (parametros.pos.includes("Call"))
    Validaciones.MostrarAgregarCampo("put-call", `call: ${parametros.call.toFixed(4)}`);
  else
    Validaciones.MostrarAgregarCampo("put-call", `put: ${parametros.put}`);
}

function GenerarGrafica(parametros) {
  const vector = Operaciones.CalcularLabeles(parametros, 1.00);
  const pendiente = Operaciones.CalcularPendiente(vector);
  const pyg = Operaciones.CalcularPyg(vector, parametros);

  let chart = new Chartist.Line('.ct-chart', {
    // Naming the series with the series object array notation
    series: [{
      name: 'series-1',
      data: pendiente,
    }, {
      name: 'series-2',
      data: pyg,
    }, {
      name: 'series-3',
      data: Operaciones.SumarVectores(pendiente, pyg, parametros.strike),
    }]
  }, {
    fullWidth: true,
    // Within the series options you can use the series names
    // to specify configuration that will only be used for the
    // specific series.
    series: {
      'series-1': {
        //lineSmooth: Chartist.Interpolation.step()
      },
      'series-2': {
        //lineSmooth: Chartist.Interpolation.simple(),
        showArea: true
      },
      'series-3': {
        showPoint: false
      }
    }
  }, [
    // You can even use responsive configuration overrides to
    // customize your series configuration even further!
    ['screen and (max-width: 500px)', {
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.none()
        },
        'series-2': {
          lineSmooth: Chartist.Interpolation.none(),
          showArea: false
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.none(),
          showPoint: true
        }
      }
    }]
  ]);
}
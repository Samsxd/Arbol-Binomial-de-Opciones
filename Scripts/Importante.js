
function algo() {
  let parametros = new Object();
  const decimal = 10000;
  let mensaje = "";
  parametros.spot = Math.round(document.getElementById("spot").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.spot, "El spot está mal, ");
  parametros.strike = Math.round(document.getElementById("strike").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.strike, "El strike está mal, ");
  parametros.u = Math.round(document.getElementById("u").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.u, "La u está mal, ");
  mensaje += validarMaximo(u, "u");
  parametros.d = Math.round(document.getElementById("d").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.d, "La d está mal, ");
  mensaje += validarMaximo(d, "d");
  parametros.T = Math.round(document.getElementById("T").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.T, "El tiempo está mal, ");
  parametros.pasos = Math.round(document.getElementById("pasos").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.pasos, "El numero de pasos está mal, ");
  parametros.tasa = Math.round(document.getElementById("tasa").value * decimal) / decimal;
  mensaje += validarCamposNumericos(parametros.tasa, "La tasa está mal, ");
  let selectOpcion = document.getElementById("opcion");
  parametros.opcion = selectOpcion.options[selectOpcion.selectedIndex].text;
  mensaje += validarCamposSelect(parametros.opcion, "La opcion está mal, ");
  let selectPos = document.getElementById("pos");
  parametros.pos = selectPos.options[selectPos.selectedIndex].text;
  mensaje += validarCamposSelect(parametros.pos, "La posicion está mal ");

  if (mensaje == "") {
    GenerarAlertaExito(parametros);
  }
  else
    GenerarAlertaError(mensaje);
  let prima = document.getElementById("prima");
  prima.style.display = "none";

}
function GenerarAlertaError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Cancelado ',
    text: 'Los campos estan mal digilenciados!',
    footer: mensaje
  });
}

function GenerarAlerta(mensaje) {
  Swal.fire({
    icon: 'success',
    title: 'Resultados ',
    text: mensaje,
    footer: ""
  });
}


function GenerarAlertaExito(parametros) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true
  });

  swalWithBootstrapButtons.fire({
    title: '¿Estas seguro?',
    text: "Se va a generar el Arbolito",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, generar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      swalWithBootstrapButtons.fire(
        'Generado! (>w<)',
        'Tus datos han sido procesados',
        'success'
      )
      CalcularOtrosDatos(parametros);
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      let tablita = document.getElementById("tablita");
      tablita.innerHTML = "";
      let prima = document.getElementById("prima");
      prima.style.display = "none";
      swalWithBootstrapButtons.fire(
        'Cancelado!',
        'Tus datos no serán procesados :(',
        'error'
      )
    }
  });
}

function validarMaximo(campo, nombre) {
  if (campo > 2)
    return `${nombre} no puede ser mayor que 2\n`;
  else
    return "";
}

function validarCamposNumericos(campo, msg) {
  if (campo > 0 && campo >= 0.1)
    return "";
  else
    return msg + "\n";
}

function validarCamposSelect(campo, msg) {
  if (campo != "Seleccionar...")
    return "";
  else
    return msg + "\n";
}

function CalcularOtrosDatos(parametros) {
  parametros.deltaT = (parametros.T / parametros.pasos) / 12;
  parametros.i = Math.exp(-(parametros.tasa / 100) * parametros.deltaT);
  parametros.ProbabilidadAlza = ((Math.exp((parametros.tasa / 100) * parametros.deltaT) - parametros.d) / (parametros.u - parametros.d));
  parametros.ProbabilidadBaja = 1 - parametros.ProbabilidadAlza;

  const matrixGrafica = new Array();
  const matrixSpots = new Array();
  crearMatriz(parametros, matrixGrafica);
  CrearEstructura(parametros, matrixGrafica);
  CalcularSpots(matrixSpots, parametros);
  const matrixPrimas = new Array(parametros.middle);
  if (parametros.opcion === "Europea")
    CalcularPrimaEuropea(matrixSpots, matrixPrimas, parametros);
  else
    CalcularPrimaAmericana(matrixSpots, matrixPrimas, parametros);
  let contador = 0;
  let tablita = document.getElementById("tablita");
  tablita.innerHTML = "";
  for (let i = 0; i < matrixGrafica.length; i++) {
    let fila = tablita.insertRow();
    fila.style.width = "40px";
    fila.style.height = "40px";
    let filaMatriz = matrixGrafica[i];
    let filaSpot = matrixSpots[i];
    let filaPrima = matrixPrimas[i];
    for (let j = 0; j < filaMatriz.length; j++) {
      let columna = fila.insertCell();
      columna.style.width = "40px";
      columna.style.height = "40px";
      columna.style.padding = "1px";
      if (filaMatriz[j] === 1) {
        let valorF = (filaPrima[contador].toFixed(4));
        columna.innerHTML = `<div><button class="res-circle" onclick="GenerarAlerta('S:${filaSpot[contador]} F:${valorF}');"></button></div>`;
        contador++;
      }

    }
    contador = 0;
  }
  let prima = document.getElementById("prima");
  let temp = matrixPrimas[0];
  prima.innerText = `Prima(F): ${temp[0].toFixed(4)}`;
  prima.style.display = "block";
}


function crearMatriz(parametros, matrix) {
  parametros.size = parametros.pasos * 3;
  parametros.middle = Math.floor(parametros.size / 2);
  parametros.middle = parametros.pasos + 1 === parametros.middle ? parametros.middle : parametros.pasos + 1;
  let size_ = parametros.size % 2 === 0 ? 1 : 0;
  let size = parametros.size % 2 === 0 ? 2 : 3;

  let tempMx = new Array();
  for (let i = 0; i < parametros.middle; i++) {
    for (let j = 0; j < parametros.size + size_ - parametros.pasos + size; j++) {
      tempMx.push('*');
    }
    matrix.push(tempMx);
    tempMx = [];
  }
}

function CrearEstructura(parametros, matrix) {
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    if (i > 0) {
      for (let j = 0; j < row.length; j++) {
        if (j === (parametros.middle + i) || j === (parametros.middle - i)) {
          row[j] = 1;
        }
      }
    } else {
      row[parametros.middle] = 1;
    }
  }
  Completar(matrix, parametros);
}

function Completar(matrix, parametros) {
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    if (i > 0) {
      for (let j = (parametros.middle - i); j < (parametros.middle + i); j += 2) {
        if (j > (parametros.middle - i)) {
          row[j] = 1;
        }
      }
    }
  }
}
function CalcularSpots(matrix, parametros) {
  let tempMx = new Array();
  tempMx.push(parametros.spot);
  matrix.push(tempMx);
  tempMx = [];

  for (let i = 1; i < parametros.middle; i++) {
    for (let j = 0; j < i + 1; j++) {
      let valor = parametros.spot * (parametros.d ** (i - j)) * (parametros.u ** (j));
      tempMx.push(valor);

    }
    matrix.push(tempMx);
    tempMx = [];
  }
}
function CalcularPrimaEuropea(matrixSpots, matrixPrimas, parametros) {
  let contador = 1;
  let tempMx = new Array();
  let SpotTemporal = matrixSpots[matrixSpots.length - contador];
  for (let i = 0; i < SpotTemporal.length; i++) {
    switch (parametros.pos) {
      case "Largo Call":
      case "Corto Call":
        let valor = Math.max((SpotTemporal[i] - parametros.strike), 0);
        tempMx.push(valor);
        break;
      case "Largo Put":
      case "Corto Put":
        let valor1 = Math.max((parametros.strike - SpotTemporal[i]), 0);
        tempMx.push(valor1);
        break;
      default:
        break;
    }

  }
  matrixPrimas[parametros.middle - contador] = tempMx;
  contador++;
  tempMx = [];
  for (let i = matrixSpots.length - contador; i > -1; i--) {
    let temporal = matrixSpots[i];
    let anterior = matrixPrimas[i + 1];
    for (let j = 0; j < temporal.length; j++) {
      let valor = parametros.i * ((anterior[j] * parametros.ProbabilidadBaja) + (anterior[j + 1] * parametros.ProbabilidadAlza));
      tempMx.push(valor);
    }
    matrixPrimas[parametros.middle - contador] = tempMx;
    contador++;
    tempMx = [];
  }


}
function CalcularPrimaAmericana(matrixSpots, matrixPrimas, parametros) {
  let contador = 1;
  let tempMx = new Array();
  let SpotTemporal = matrixSpots[matrixSpots.length - contador];
  for (let i = 0; i < SpotTemporal.length; i++) {
    switch (parametros.pos) {
      case "Largo Call":
      case "Corto Call":
        let valor = Math.max((SpotTemporal[i] - parametros.strike), 0);
        tempMx.push(valor);
        break;
      case "Largo Put":
      case "Corto Put":
        let valor1 = Math.max((parametros.strike - SpotTemporal[i]), 0);
        tempMx.push(valor1);
        break;
      default:
        break;
    }

  }
  matrixPrimas[parametros.middle - contador] = tempMx;
  contador++;
  tempMx = [];
  for (let i = matrixSpots.length - contador; i > -1; i--) {
    let temporal = matrixSpots[i];
    let anterior = matrixPrimas[i + 1];
    for (let j = 0; j < temporal.length; j++) {
      let valor = parametros.i * ((anterior[j] * parametros.ProbabilidadBaja) + (anterior[j + 1] * parametros.ProbabilidadAlza));
      let valor2 = 0;
      if (parametros.pos.includes("Call"))
        valor2 = Math.max((temporal[j] - parametros.strike), 0);
      else
        valor2 = Math.max((parametros.strike - temporal[j]), 0);
      tempMx.push(Math.max(valor, valor2));
    }
    matrixPrimas[parametros.middle - contador] = tempMx;
    contador++;
    tempMx = [];
  }
}
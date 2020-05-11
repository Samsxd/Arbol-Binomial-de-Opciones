const Validaciones = {};

// Realiza las validaciones del formulario de las gráficas
Validaciones.ValidarFormluarioGraficasSyK = function (parametros, decimal) {
    let mensaje = "";
    parametros.spot = Math.round(document.getElementById("spot").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.spot, "El spot está mal, ");

    parametros.strike1 = Math.round(document.getElementById("strike").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike1, "El strike está mal, ");

    return mensaje;
};

// Realiza las validaciones del formulario de las gráficas
Validaciones.ValidarFormluarioGraficasSpreadsCombi = function (parametros, decimal) {
    let mensaje = "";
    parametros.spot = Math.round(document.getElementById("spot_").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.spot, "El spot está mal, ");

    parametros.strike1 = Math.round(document.getElementById("strike1").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike1, "El strike1 está mal, ");

    parametros.strike2 = Math.round(document.getElementById("strike2").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike2, "El strike2 está mal, ");

    return mensaje;
};

// Realiza las validaciones del formulario de las gráficas
Validaciones.ValidarFormluarioGraficasMariposas = function (parametros, decimal) {
    let mensaje = "";
    parametros.spot = Math.round(document.getElementById("spot_").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.spot, "El spot está mal, ");

    parametros.strike1 = Math.round(document.getElementById("strike1").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike1, "El strike1 está mal, ");

    parametros.strike2 = Math.round(document.getElementById("strike2").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike2, "El strike2 está mal, ");

    parametros.strike3 = Math.round(document.getElementById("strike3").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike3, "El strike3 está mal, ");

    return mensaje;
};

// Realiza las validaciones del formulario de blacksholes
Validaciones.ValidarFormluarioBlackSholes = function (parametros, decimal) {
    let mensaje = "";
    parametros.spot = Math.round(document.getElementById("spot").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.spot, "El spot está mal, ");

    parametros.strike = Math.round(document.getElementById("strike").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike, "El strike está mal, ");

    parametros.T = Math.round(document.getElementById("T").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.T, "El tiempo está mal, ");

    parametros.tasa = Math.round(document.getElementById("tasa").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.tasa, "La tasa está mal, ");

    parametros.volatilidad = Math.round(document.getElementById("volatilidad").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.volatilidad, "La volatilidad está mal, ");

    let selectPos = document.getElementById("pos");
    parametros.pos = selectPos.options[selectPos.selectedIndex].text;
    mensaje += Validaciones.validarCamposSelect(parametros.pos, "La posicion está mal ");

    return mensaje;
};

// Realiza las validaciones del formulario del arbol binomial
Validaciones.ValidarFormluarioArbol = function (parametros, decimal) {
    let mensaje = "";
    parametros.spot = Math.round(document.getElementById("spot").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.spot, "El spot está mal, ");

    parametros.strike = Math.round(document.getElementById("strike").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike, "El strike está mal, ");

    parametros.u = Math.round(document.getElementById("u").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.u, "La u está mal, ");
    mensaje += Validaciones.validarMaximo(u, "u");

    parametros.d = Math.round(document.getElementById("d").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.d, "La d está mal, ");
    mensaje += Validaciones.validarMaximo(d, "d");

    parametros.T = Math.round(document.getElementById("T").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.T, "El tiempo está mal, ");

    parametros.pasos = Math.round(document.getElementById("pasos").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.pasos, "El numero de pasos está mal, ");

    parametros.tasa = Math.round(document.getElementById("tasa").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.tasa, "La tasa está mal, ");

    parametros.volatilidad = Math.round(document.getElementById("volatilidad").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.volatilidad, "La volatilidad está mal, ");

    let selectOpcion = document.getElementById("opcion");
    parametros.opcion = selectOpcion.options[selectOpcion.selectedIndex].text;
    mensaje += Validaciones.validarCamposSelect(parametros.opcion, "La opcion está mal, ");

    let selectPos = document.getElementById("pos");
    parametros.pos = selectPos.options[selectPos.selectedIndex].text;
    mensaje += Validaciones.validarCamposSelect(parametros.pos, "La posicion está mal ");

    return mensaje;
};

// Valida que el campo no sea mayor a 2
Validaciones.validarMaximo = function (campo, nombre) {
    if (campo > 2)
        return `${nombre} no puede ser mayor que 2\n`;
    else
        return "";
};

// Valida si un campo sea positivo y no es cero
Validaciones.validarCamposNumericos = function (campo, msg) {
    if (campo > 0 && campo >= 0.1)
        return "";
    else
        return msg + "\n";
};

// Valida que los campos select tengan una opción
Validaciones.validarCamposSelect = function (campo, msg) {
    if (campo != "Seleccionar...")
        return "";
    else
        return msg + "\n";
}

// Oculta un campo dado su id (el id se encuentra en index.html)
Validaciones.OcultarCampo = function (campo) {
    document.getElementById(campo).style.display = "none";
};
// Muestra un campo dado su id (el id se encuentra en index.html)
Validaciones.MostrarCampo = function (campo, display) {
    if (display)
        document.getElementById(campo).style.display = display;
    else
        document.getElementById(campo).style.display = "flex";
};

// Muestra un campo dado su id y le asigna un valor
Validaciones.MostrarAgregarCampo = function (campo, valor) {
    document.getElementById(`${campo}-div`).style.display = "grid";
    document.getElementById(campo).innerText = valor;
};
//muestra el nombre de la linea
Validaciones.MostrarNombreColor = function (linea1, linea2, linea3, linea4) {
    document.getElementById("linea1").innerText = linea1;
    document.getElementById("linea2").innerText = linea2;
    document.getElementById("linea3").innerText = linea3;
    if (linea4)
        document.getElementById("linea4").innerText = linea4;
}
//Borra los nombres de los otros formularios
Validaciones.BorrarNombres = function () {
    document.getElementById("linea1").innerText = "";
    document.getElementById("linea2").innerText = "";
    document.getElementById("linea3").innerText = "";
    document.getElementById("linea4").innerText = "";
}


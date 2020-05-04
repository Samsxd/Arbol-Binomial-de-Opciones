const Validaciones = {};

// realiza las validaciones del formulario de las gráficas
Validaciones.ValidarFormluarioGraficas = function (parametros, decimal) {
    let mensaje = "";
    parametros.spot = Math.round(document.getElementById("spot").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.spot, "El spot está mal, ");

    parametros.strike = Math.round(document.getElementById("strike").value * decimal) / decimal;
    mensaje += Validaciones.validarCamposNumericos(parametros.strike, "El strike está mal, ");

    return mensaje;
};

// realiza las validaciones del formulario de blacksholes
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

// realiza las validaciones del formulario del arbol binomial
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

// valida que el campo no sea mayor a 2
Validaciones.validarMaximo = function (campo, nombre) {
    if (campo > 2)
        return `${nombre} no puede ser mayor que 2\n`;
    else
        return "";
};
// valida si un campo sea positivo y no es cero
Validaciones.validarCamposNumericos = function (campo, msg) {
    if (campo > 0 && campo >= 0.1)
        return "";
    else
        return msg + "\n";
};

// valida que los campos select tengan una opción
Validaciones.validarCamposSelect = function (campo, msg) {
    if (campo != "Seleccionar...")
        return "";
    else
        return msg + "\n";
}

// oculta un campo dado su id
Validaciones.OcultarCampo = function (campo) {
    document.getElementById(campo).style.display = "none";
};

Validaciones.MostrarCampo = function (campo) {
    document.getElementById(campo).style.display = "flex";
};

// muestra un campo dado su id y le asigna un valor
Validaciones.MostrarAgregarCampo = function (campo, valor){
    document.getElementById(`${campo}-div`).style.display = "grid";
    document.getElementById(campo).innerText = valor;
};


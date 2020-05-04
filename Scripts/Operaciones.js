const Operaciones = {};

// crea una url que redirecciona al formulario deseado
Operaciones.Redireccionar = function (path) {
    if (location.href.includes("?path")) {
        let aux = location.href.split("=");
        location.href = `${aux[0]}=${path}`;
    } else
        location.href = `${location.href}?path=${path}`;
};

// habilita o deshabilita los campos dado la url 
Operaciones.ObtenerFomulario = function () {
    if (location.href.includes("?path")) {
        let aux = location.href.split("=");
        document.getElementById(aux[1]).classList.add("active");
    } else {
        document.getElementById("contenedor").style.display = "none";
    }
};

// devuelve el parametros de la url
Operaciones.ObtenerParametro = function () {
    if (location.href.includes("?path"))
        return location.href.split("=")[1];
    else
        return "";
};

// crea una matriz n x m dado la cantidad de pasos con el valor de *
Operaciones.crearMatriz = function (parametros, matrix) {
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
};

// recorre la matriz de * creando la estructura del arbol remplazando los valores con un 1 
Operaciones.CrearEstructura = function (parametros, matrix) {
    // crea los valores de los extremos
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
    Operaciones.Completar(matrix, parametros);
};

// recorre la matrix de * creando la estructura añadiendo los valores intermedios
Operaciones.Completar = function (matrix, parametros) {
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
};

// calcula el spot de cada nodo
Operaciones.CalcularSpots = function (matrix, parametros) {
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
};

//
Operaciones.CalcularPrimaEuropea = function (matrixSpots, matrixPrimas, parametros) {
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
    // se recorre la matriz de spots desde la última fila hasta la primera
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

//
Operaciones.CalcularPrimaAmericana = function (matrixSpots, matrixPrimas, parametros) {
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
    // se recorre la matriz de spots desde la última fila hasta la primera
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
};

Operaciones.CalcularLabeles = function (parametros) {
    let diferencial = parametros.spot - parametros.strike;
    let valorFinal = parametros.spot + diferencial;
    let arreglo = new Array();
    for (let i = 0; i < valorFinal; i += 0.1) {
        arreglo.push(i.toFixed(1));
    }
    return arreglo;
}

Operaciones.SumarVectores = function (v1, v2, strike) {
    let arreglo = new Array();
    for (let i = 0; i < v1.length; i++) {
        arreglo.push(v1[i] + v2[i]);
    }
    return arreglo;
}

Operaciones.CalcularPendiente = function (vector) {
    let arreglo = new Array();
    for (let i = 0; i < vector.length; i++) {
        arreglo.push(parseFloat(vector[i]));
    }
    return arreglo;
}

Operaciones.CalcularPyg = function (vector, parametros) {
    let pyg = parametros.spot - parametros.strike;
    let arreglo = new Array();
    for (let i = 0; i < vector.length; i++) {
        if (vector[i] > parametros.strike) {
            arreglo.push(pyg - (vector[i] - parametros.strike));
        } else
            arreglo.push(pyg);
    }
    return arreglo;
}


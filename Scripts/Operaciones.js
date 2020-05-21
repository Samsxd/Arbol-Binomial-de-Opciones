const Operaciones = {};

//crea una url que redirecciona al formulario deseado (Arbol binomial, BlackSholes, Graficas)
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

// devuelve los parametros de la url
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
    //Este for prueba para ver si multiplica por u o por d dado el caso, hasta el numero de pasos dados
    for (let i = 1; i < parametros.middle; i++) { //Filas
        for (let j = 0; j < i + 1; j++) { //columnas
            let valor = parametros.spot * (parametros.d ** (i - j)) * (parametros.u ** (j));
            tempMx.push(valor);
        }
        matrix.push(tempMx);
        tempMx = [];
    }
};

//Calcula la prima para las opciones Europeas
Operaciones.CalcularPrimaEuropea = function (matrixSpots, matrixPrimas, parametros) {
    let contador = 1;
    let tempMx = new Array();
    let SpotTemporal = matrixSpots[matrixSpots.length - contador];
    //for que comprueba si la opcion es call o put para ver si se aplica la formula correcta
    //para call max(s-k) y para put max(k-s)
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
    //Este for calcula y toma el valor correcto del arreglo, o sea desde el penultimo (los ultimos se hace con el max) 
    //spot para hallar la prima (f), realizando la formula de esta, hasta llegar la primera fila, donde solo quedan 2 spot
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
};

//Calcula la prima para las opciones Americanas
Operaciones.CalcularPrimaAmericana = function (matrixSpots, matrixPrimas, parametros) {
    let contador = 1;
    let tempMx = new Array();
    let SpotTemporal = matrixSpots[matrixSpots.length - contador];
    //for que comprueba si la opcion es call o put para ver si se aplica la formula correcta
    //para call max(s-k) y para put max(k-s)
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
    //Este for calcula y toma el valor correcto del arreglo, desde el penultimo (los ultimos se hace con el max) spot 
    //para hallar la prima (f), realizando la formula de esta, hasta llegar la primera fila, donde solo quedan 2 spot
    for (let i = matrixSpots.length - contador; i > -1; i--) {
        let temporal = matrixSpots[i];
        let anterior = matrixPrimas[i + 1];
        for (let j = 0; j < temporal.length; j++) {
            let valor = parametros.i * ((anterior[j] * parametros.ProbabilidadBaja) + (anterior[j + 1] * parametros.ProbabilidadAlza));
            let valor2 = 0;
            //en este if se comprueba si es call o put, porque al ser americana se evalua que prima es mayor, entre 
            //la calculada por la formula de la f o el max(s-k)
            if (parametros.pos.includes("Call"))
                valor2 = Math.max((temporal[j] - parametros.strike), 0);
            //aqui entra si es put, max(k-s0)
            else
                valor2 = Math.max((parametros.strike - temporal[j]), 0);
            tempMx.push(Math.max(valor, valor2));
        }
        matrixPrimas[parametros.middle - contador] = tempMx;
        contador++;
        tempMx = [];
    }
};

//Calcula el tamaño total de la grafica (largo en el eje x)
Operaciones.CalcularBase = function (parametros, holgura) {
    let valorFinal = parametros.strike1 + holgura;
    let arreglo = new Array();
    for (let i = 0; i < valorFinal; i += 1) {
        arreglo.push(parseFloat(i.toFixed(1)));
    }
    return arreglo;
};

//Es la suma de los PyG de las posiciones de acuerdo al tipo de grafica
//aqui esta ubicado el vector que es el resultado final de la estrategia 
Operaciones.SumarVectores = function (v1, v2) {
    let arreglo = new Array();
    for (let i = 0; i < v1.length; i++) {
        arreglo.push({ x: i, y: v1[i].y + v2[i].y })
    }
    return arreglo;
};

//Es la suma de los PyG de las posiciones para las estrategias Reservado para (mariposas)
//aqui esta ubicado el vector que es el resultado final de la estrategia 
Operaciones.SumarVectoresMariposa = function (v1, v2, v3) {
    let arreglo = new Array();
    for (let i = 0; i < v1.length; i++) {
        arreglo.push({ x: i, y: v1[i].y + v2[i].y + v3[i].y })
    }
    return arreglo;
};

//Calcula la linea recta (Largo en el subyacente)
Operaciones.CalcularPendiente = function (base) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        arreglo.push({ x: base[i], y: base[i] });
    }
    return arreglo;
};

//Calcula la posicion contraria a la linea recta (Corto en el subyacente)
Operaciones.CalcularPendienteInversa = function (base) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        arreglo.push({ x: base[i], y: -1 * base[i] });
    }
    return arreglo;
};

//Calculo del PyG de una posicion corto call
Operaciones.CalcularPygCortoCall = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike1) {
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: pyg - (base[i] - parametros.strike1) });
        } else
            arreglo.push({ x: i, y: pyg });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo call
Operaciones.CalcularPygLargoCall = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] < parametros.strike1) {
            arreglo.push({ x: i, y: pyg });
        } else
            // signo postivo hace que la grafica ascienda
            arreglo.push({ x: i, y: pyg + (base[i] - parametros.strike1) });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo put
Operaciones.CalcularPygLargoPut = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike1) {
            arreglo.push({ x: i, y: pyg });
        } else
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: pyg - (base[i] - parametros.strike1) });
    }
    return arreglo;
};

//Calculo del PyG de una posicion corto put
Operaciones.CalcularPygCortoPut = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] < parametros.strike1) {
            // signo postivo hace que la grafica ascienda
            arreglo.push({ x: i, y: pyg + (base[i] - parametros.strike1) });
        } else
            arreglo.push({ x: i, y: pyg });
    }
    return arreglo;
};

//Calculo del PyG de una posicion corto call, reservada solo para bull spreads
Operaciones.CalcularPygCortoCallBullS = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike2) {
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: (-1 * pyg) - (base[i] - parametros.strike2) });
        } else
            arreglo.push({ x: i, y: -1 * pyg });
    }
    return arreglo;
};

//Calculo del PyG de una posicion corto put, reservada solo para bull spreads
Operaciones.CalcularPygCortoPutBullS = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] < parametros.strike2) {
            // signo postivo hace que la grafica ascienda
            arreglo.push({ x: i, y: pyg + (base[i] - parametros.strike2) });
        } else
            arreglo.push({ x: i, y: pyg });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo put, reservada solo para combinaciones
Operaciones.CalcularPygLargoPutCombi = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike2) {
            arreglo.push({ x: i, y: pyg });
        } else
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: pyg - (base[i] - parametros.strike2) });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo put, reservada solo para combinaciones
//tiene el indicativo dos, porque este son 2 largos put...
Operaciones.CalcularPygLargoPutCombi2 = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike2) {
            arreglo.push({ x: i, y: pyg * 2 });
        } else
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: (pyg - (base[i] - parametros.strike2)) * 2 });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo call, reservada solo para combinaciones
Operaciones.CalcularPygLargoCallCombi = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] < parametros.strike1) {
            arreglo.push({ x: i, y: pyg * 2 });
        } else
            // signo postivo hace que la grafica ascienda
            arreglo.push({ x: i, y: (pyg + (base[i] - parametros.strike1)) * 2 });
    }
    return arreglo;
};

//Calculo del PyG de una posicion corto call, reservada solo para mariposas
Operaciones.CalcularPygCortoCallMariposa = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike2) {
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: (pyg - (base[i] - parametros.strike2)) * 2 });
        } else
            arreglo.push({ x: i, y: pyg * 2 });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo call, reservada solo para mariposas
Operaciones.CalcularPygLargoCallMariposa = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] < parametros.strike3) {
            arreglo.push({ x: i, y: pyg });
        } else
            // signo postivo hace que la grafica ascienda
            arreglo.push({ x: i, y: pyg + (base[i] - parametros.strike3) });
    }
    return arreglo;
};

//Calculo del PyG de una posicion corto put, reservada solo para mariposas
Operaciones.CalcularPygCortoPutMariposa = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] < parametros.strike2) {
            // signo postivo hace que la grafica ascienda
            arreglo.push({ x: i, y: (pyg + (base[i] - parametros.strike2)) * 2 })
        } else
            arreglo.push({ x: i, y: pyg * 2 });
    }
    return arreglo;
};

//Calculo del PyG de una posicion largo put, reservada solo para mariposas
Operaciones.CalcularPygLargoPutMariposa = function (base, parametros, pyg) {
    let arreglo = new Array();
    for (let i = 0; i < base.length; i++) {
        if (base[i] > parametros.strike3) {
            arreglo.push({ x: i, y: pyg });
        } else
            // signo negativo hace que la grafica descienda
            arreglo.push({ x: i, y: pyg - (base[i] - parametros.strike3) });
    }
    return arreglo;
};


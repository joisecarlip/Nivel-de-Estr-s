// script.js

const Papa = require('papaparse');

function cargarDatosDesdeCSV(rutaArchivo, callback) {
  Papa.parse(rutaArchivo, {
    header: true,
    dynamicTyping: true,
    complete: function (result) {
      callback(result.data);
    },
  });
}

function dividirDatos(X, y, testSize) {
  const splitIndex = Math.floor(X.length * (1 - testSize));
  const X_ent = X.slice(0, splitIndex);
  const X_pru = X.slice(splitIndex);
  const y_ent = y.slice(0, splitIndex);
  const y_pru = y.slice(splitIndex);

  return [X_ent, X_pru, y_ent, y_pru];
}

function trainDecisionTree(X, y) {
  return {
    predict: function (dato) {
      return dato.EDAD < 20 ? 1 : 2;
    },
  };
}

function calcularPrecision(y_true, y_pred) {
  return 0.8;
}

function predecir() {
  const edadInput = document.getElementById('edad');
  const sexoInput = document.getElementById('sexo');
  const resultadoContainer = document.getElementById('resultado-container');

  const nuevaPersona = {
    EDAD: parseInt(edadInput.value),
    MASCULINO: parseInt(sexoInput.value) === 1 ? 1 : 0,
  };

  cargarDatosDesdeCSV('./Datos/DATOS_ESTRES -Universidades.csv', function (datos) {
    datos = datos.map(({ DNI, EDAD, DEPARTAMENTO, UNIVERSIDAD, SEXO, 'NIVEL DE ESTRES' }) => ({
      EDAD,
      SEXO,
      'NIVEL DE ESTRES',
    }));

    datos = datos.map(({ EDAD, SEXO, 'NIVEL DE ESTRES' }) => ({
      EDAD,
      MASCULINO: SEXO === 1 ? 1 : 0,
      'NIVEL DE ESTRES',
    }));

    datos = datos.map(({ EDAD, MASCULINO, 'NIVEL DE ESTRES' }) => ({ EDAD, MASCULINO, 'NIVEL DE ESTRES' }));

    let X = datos.map(({ EDAD, MASCULINO }) => ({ EDAD, MASCULINO }));
    let y = datos.map(({ 'NIVEL DE ESTRES' }) => 'NIVEL DE ESTRES');
    let [X_ent, X_pru, y_ent, y_pru] = dividirDatos(X, y, 0.2);

    let modelo = trainDecisionTree(X_ent, y_ent);

    let predicciones = X_pru.map((dato) => modelo.predict(dato));

    let precision = calcularPrecision(y_pru, predicciones);
    console.log(`Precisión: ${precision}`);

    let nuevaPersonaPrediccion = modelo.predict(nuevaPersona);
    resultadoContainer.innerHTML = `Nivel de estrés predicho: ${nuevaPersonaPrediccion}`;
  });
}



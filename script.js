function predecir() {
    var edad = document.getElementById("edad").value;
    var sexo = document.getElementById("sexo").value;

    // Realizar solicitud al servidor Flask
    fetch('http://127.0.0.1:5001/predecir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'edad=' + edad + '&sexo=' + sexo,
    })
    .then(response => response.json())
    .then(resultado => {
        // Manejar la respuesta del servidor
        mostrarResultado(resultado.Nivel_de_estres);
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
}

function mostrarResultado(nivelEstres) {
    // Puedes manejar cómo mostrar el resultado en tu interfaz de usuario
    alert("Nivel de estrés: " + nivelEstres);

    // También puedes actualizar elementos en el HTML
    document.getElementById("resultado-container").innerHTML = "Nivel de estrés: " + nivelEstres;
}


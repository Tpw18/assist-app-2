function abrirPanel(tipo){

    const panel = document.getElementById("panel");

    const titulo = document.getElementById("panel-titulo");

    const texto = document.getElementById("panel-texto");

    const imagen = document.getElementById("panel-img");

    panel.style.display = "flex";
    document.body.style.overflow = "hidden";

    if(tipo === "asistencia"){

        titulo.innerText = "Control de asistencia";

        texto.innerText =
        "Assist-App permite registrar asistencia rápidamente y mantener control total de los alumnos con tan solo un escaneo QR unico incapaz de falsificar o modificar evitando falsas asistencias o manipulaciones maliciosaas.";

        imagen.src = "img/asistencia.jpg";
    }

    if(tipo === "promedios"){

        titulo.innerText = "Promedios automáticos";

        texto.innerText =
        "Calcula promedios automáticamente sin usar planillas externas o calculos innecearios, deja que Assist-App lo haga por ti con un click y solo queda revisar.";

        imagen.src = "img/promedios.jpg";
    }

    if(tipo === "gestion"){

        titulo.innerText = "Gestión escolar";

        texto.innerText =
        "Administra cursos, reportes y estudiantes desde un único lugar sin necesidad de reconteo frecuente o revision periodica, deja que Assist-App lo haga por ti.";

        imagen.src = "img/gestion.jpg";
    }

}

function cerrarPanel(){

    document.getElementById("panel").style.display = "none";
    document.body.style.overflow = "auto";
}
const panel = document.getElementById("panel");
const titulo = document.getElementById("panel-titulo");
const texto = document.getElementById("panel-texto");
const imagen = document.getElementById("panel-img");

const contenido = {
    asistencia: {
        titulo: "Control de asistencia inteligente",
        texto: "Registro mediante códigos QR únicos e imposibles de falsificar.",
        img: "img/asistencia.jpg"
    },

    promedios: {
        titulo: "Promedios automáticos",
        texto: "Cálculos académicos precisos en tiempo real.",
        img: "img/promedios.jpg"
    },

    gestion: {
        titulo: "Gestión institucional avanzada",
        texto: "Organización completa de alumnos, cursos y reportes.",
        img: "img/gestion.jpg"
    }
};

function abrirPanel(tipo){

    const data = contenido[tipo];

    titulo.innerText = data.titulo;
    texto.innerText = data.texto;
    imagen.src = data.img;

    panel.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarPanel(){
    panel.style.display = "none";
    document.body.style.overflow = "auto";
}

const video = document.querySelector(".video-fondo");

window.addEventListener("scroll", () => {
    requestAnimationFrame(() => {
        const mover = window.scrollY * 0.08;

        video.style.transform =
        `translate(-50%, calc(-42% - ${mover}px))`;
    });
});
/**
 * Assist-App — Script principal
 * Inicializa efectos y componentes según la página activa.
 */
'use strict';

/* --------------------------------------------------------------------------
   Datos del panel modal (solo index)
   -------------------------------------------------------------------------- */

const PANEL_CONTENT = {
    asistencia: {
        titulo: 'Control de asistencia inteligente',
        texto: 'Registro mediante códigos QR únicos e imposibles de falsificar.',
        img: 'img/asistencia.jpg'
    },
    promedios: {
        titulo: 'Promedios automáticos',
        texto: 'Cálculos académicos precisos en tiempo real.',
        img: 'img/promedios.jpg'
    },
    gestion: {
        titulo: 'Gestión institucional avanzada',
        texto: 'Organización completa de alumnos, cursos y reportes.',
        img: 'img/gestion.jpg'
    }
};

/* --------------------------------------------------------------------------
   Utilidades
   -------------------------------------------------------------------------- */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Navbar — scroll y estado activo
   -------------------------------------------------------------------------- */

function initNavbar() {
    const navbar = $('.navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --------------------------------------------------------------------------
   Barra de progreso de scroll
   -------------------------------------------------------------------------- */

function initScrollProgress() {
    if (prefersReducedMotion()) return;

    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = `${percent}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* --------------------------------------------------------------------------
   Efecto de cursor (solo desktop)
   -------------------------------------------------------------------------- */

function initCursorGlow() {
    const glow = $('.cursor-glow');
    if (!glow || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) {
        glow?.remove();
        return;
    }

    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
            ticking = false;
        });
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   Parallax del dashboard preview
   -------------------------------------------------------------------------- */

function initDashboardParallax() {
    const dashboard = $('.dashboard-preview');
    if (!dashboard || prefersReducedMotion()) return;

    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const x = (window.innerWidth / 2 - e.clientX) / 40;
            const y = (window.innerHeight / 2 - e.clientY) / 40;
            dashboard.style.transform = `translate(${x}px, ${y}px)`;
            ticking = false;
        });
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   Panel modal de funciones
   -------------------------------------------------------------------------- */

function initPanel() {
    const panel = $('#panel');
    if (!panel) return;

    const titulo = $('#panel-titulo');
    const texto = $('#panel-texto');
    const imagen = $('#panel-img');
    const cerrarBtn = $('.cerrar', panel);

    const abrir = (tipo) => {
        const data = PANEL_CONTENT[tipo];
        if (!data) return;

        titulo.textContent = data.titulo;
        texto.textContent = data.texto;
        imagen.src = data.img;
        imagen.alt = data.titulo;

        panel.style.display = 'flex';
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        cerrarBtn?.focus();
    };

    const cerrar = () => {
        panel.style.display = 'none';
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    $$('[data-panel]').forEach((card) => {
        card.addEventListener('click', () => abrir(card.dataset.panel));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrir(card.dataset.panel);
            }
        });
    });

    cerrarBtn?.addEventListener('click', cerrar);

    panel.addEventListener('click', (e) => {
        if (e.target === panel) cerrar();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.style.display === 'flex') cerrar();
    });

    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
}

/* --------------------------------------------------------------------------
   Efectos en tarjetas interactivas
   -------------------------------------------------------------------------- */

function initCardEffects() {
    const cards = $$('.card:not(.card--plan), .stat, .metric, .step, .showcase-card');
    if (!cards.length) return;

    const canTilt = !prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches;

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            if (canTilt && card.classList.contains('card') && !card.classList.contains('card--plan')) {
                const rotateY = (x / rect.width - 0.5) * 12;
                const rotateX = (y / rect.height - 0.5) * -12;
                card.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('card') && !card.classList.contains('card--plan')) {
                card.style.transform = '';
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Animaciones reveal al hacer scroll
   -------------------------------------------------------------------------- */

function initReveal() {
    const elements = $$('.card:not(.card--plan), .step, .showcase-card, .stat, .metric, .faq-item, .update-card, .card--plan');
    if (!elements.length) return;

    if (prefersReducedMotion()) {
        elements.forEach((el) => el.classList.add('active'));
        return;
    }

    elements.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Contadores animados
   -------------------------------------------------------------------------- */

function initCounters() {
    const counters = $$('.counter');
    if (!counters.length) return;

    const animate = (counter) => {
        const target = Number(counter.dataset.target);
        if (!target) return;

        let value = 0;
        const step = () => {
            value += target / 80;
            if (value < target) {
                counter.textContent = Math.floor(value).toLocaleString('es-AR');
                requestAnimationFrame(step);
            } else {
                counter.textContent = target.toLocaleString('es-AR');
            }
        };
        step();
    };

    if (prefersReducedMotion()) {
        counters.forEach((c) => {
            c.textContent = Number(c.dataset.target).toLocaleString('es-AR');
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
}

/* --------------------------------------------------------------------------
   Acordeón FAQ
   -------------------------------------------------------------------------- */

function initFaq() {
    $$('.faq-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            $$('.faq-item').forEach((el) => {
                el.classList.remove('active');
                $('.faq-btn', el)?.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Formulario de contacto (validación básica)
   -------------------------------------------------------------------------- */

function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = $('#nombre', form)?.value.trim();
        const email = $('#email', form)?.value.trim();
        const mensaje = $('#mensaje', form)?.value.trim();

        if (!nombre || !email || !mensaje) {
            alert('Completá todos los campos obligatorios.');
            return;
        }

        const subject = encodeURIComponent(`Consulta Assist-App — ${nombre}`);
        const body = encodeURIComponent(
            `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`
        );

        window.location.href = `mailto:contactoassistapp@gmail.com?subject=${subject}&body=${body}`;
    });
}

/* --------------------------------------------------------------------------
   Inicialización
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollProgress();
    initCursorGlow();
    initDashboardParallax();
    initPanel();
    initCardEffects();
    initReveal();
    initCounters();
    initFaq();
    initContactForm();
});

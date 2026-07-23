/**
 * DOJANG MASTER - CLIENT-SIDE INTERACTIVITY
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MENU DE NAVEGACIÓN MÓVIL
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // Cambiar header en scroll (efecto difuminado/oscuro)
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. ACTIVAR ENLACE EN SCROLL & REVELAR ELEMENTOS
    // ==========================================
    const sections = document.querySelectorAll('section');
    const scrollRevealElements = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25 // Activa cuando el 25% del elemento es visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' }); // Ajuste para detectar la sección central en viewport

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Observador para animaciones de revelado
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // ==========================================
    // 3. SECTOR INTERACTIVO DE CINTURONES
    // ==========================================
    const beltButtons = document.querySelectorAll('.belt-btn');
    const beltDetailCard = document.getElementById('beltDetailCard');
    const beltStripeDisplay = document.getElementById('beltStripeDisplay');
    const beltGrade = document.getElementById('beltGrade');
    const beltTitle = document.getElementById('beltTitle');
    const beltMeaningText = document.getElementById('beltMeaningText');
    const beltReqList = document.getElementById('beltReqList');

    // Datos detallados de los cinturones
    const beltsData = {
        blanco: {
            grade: "10° Gup",
            title: "Cinturón Blanco (Sip Gup)",
            className: "blanco",
            meaning: "Representa la inocencia del estudiante principiante que no posee conocimientos previos de Taekwondo. Es el lienzo en blanco, la semilla que aún está bajo la tierra esperando brotar con el cuidado del maestro.",
            requirements: [
                "Posiciones básicas de pie (Ap Sogui, Ap Kubi) y de saludo (Charyot, Gyeong-nye).",
                "Defensas fundamentales: Are Maki (defensa baja) y Olgul Maki (defensa alta).",
                "Golpes de puño básicos dirigidos a la zona media (Montong Jireugi).",
                "Principios de cortesía y disciplina básica del Dojang."
            ],
            stripeColor: "transparent"
        },
        amarillo: {
            grade: "8° Gup",
            title: "Cinturón Amarillo (Pal Gup)",
            className: "amarillo",
            meaning: "Representa la tierra en la cual brota la planta y echa sus primeras raíces, a medida que los cimientos del Taekwondo se van estableciendo sólidamente en el alumno.",
            requirements: [
                "Defensas avanzadas: Montong An Maki (defensa media interna).",
                "Patada de frente (Ap Chagi) controlando la recogida de la rodilla.",
                "Poomsae: Ejecución completa y fluida de Taegeuk Il Jang (1ª Forma).",
                "Ataques de puño doble en combinación con pasos de desplazamiento."
            ],
            stripeColor: "transparent"
        },
        verde: {
            grade: "6° Gup",
            title: "Cinturón Verde (Yuk Gup)",
            className: "verde",
            meaning: "Representa el crecimiento de la planta, indicando que las habilidades físicas y técnicas del Taekwondo comienzan a florecer y a desarrollarse con fuerza.",
            requirements: [
                "Defensa: Sonnal Montong Maki (defensa media con mano de sable abierta).",
                "Pateo: Patada circular de costado (Dollyo Chagi) y patada lateral (Yop Chagi).",
                "Poomsae: Taegeuk Sam Jang (3ª Forma), mostrando ritmo y equilibrio.",
                "Sparring: Combate básico a un paso (Hanbon Kyorugi) aplicando llaves de control."
            ],
            stripeColor: "transparent"
        },
        azul: {
            grade: "4° Gup",
            title: "Cinturón Azul (Sa Gup)",
            className: "azul",
            meaning: "Representa el cielo azul hacia el cual la planta crece y madura, convirtiéndose en un árbol imponente a medida que avanza el entrenamiento y la técnica.",
            requirements: [
                "Defensas: Bakat Montong Maki (defensa media externa con el antebrazo).",
                "Pateo de giro: Dwit Chagi (patada de mula/espalda) y patadas en salto.",
                "Poomsae: Taegeuk Oh Jang (5ª Forma) con cambios bruscos de dirección.",
                "Combate libre regulado con equipo completo de protección."
            ],
            stripeColor: "transparent"
        },
        rojo: {
            grade: "2° Gup",
            title: "Cinturón Rojo (Ee Gup)",
            className: "rojo",
            meaning: "Representa el peligro y la precaución. Advierte al estudiante que debe ejercitar el autocontrol y al oponente que debe mantenerse alejado debido a la letalidad de las técnicas.",
            requirements: [
                "Técnicas complejas: Cortes con el canto de la mano y golpes de codo (Palkup).",
                "Pateo libre: Dwi Huryo Chagi (patada de gancho con giro de 360 grados).",
                "Poomsae: Taegeuk Chil Jang (7ª Forma), controlando respiración y pausas.",
                "Rompimiento de tablas (Kyokpa) utilizando técnicas de puño o patadas."
            ],
            stripeColor: "transparent"
        },
        negro: {
            grade: "1° Dan / Poom",
            title: "Cinturón Negro (Il Dan)",
            className: "negro",
            meaning: "Representa la madurez y la excelencia en el arte. Es lo opuesto al blanco, simbolizando la superación del miedo, de la oscuridad y la maestría del camino técnico y mental del Taekwondo.",
            requirements: [
                "Dominio completo de los 8 Taegeuk fundamentales.",
                "Poomsae de Dan: Koryo (forma de los hombres de la dinastía Koryo).",
                "Rompimientos múltiples con patadas aéreas acrobáticas.",
                "Conocimiento teórico de la historia marcial y arbitraje WT."
            ],
            stripeColor: "transparent"
        }
    };

    // Inicializar cinturón blanco con color en el stripe
    if (beltStripeDisplay) {
        beltStripeDisplay.className = "belt-stripe-display blanco";
    }

    beltButtons.forEach(button => {
        button.addEventListener('click', () => {
            const beltKey = button.getAttribute('data-belt');
            const data = beltsData[beltKey];

            if (!data) return;

            // Quitar clase activa de botones
            beltButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Añadir clase de animación a la tarjeta
            beltDetailCard.classList.remove('belt-animate');
            void beltDetailCard.offsetWidth; // Trigger reflow para reiniciar animación
            beltDetailCard.classList.add('belt-animate');

            // Actualizar color e info en el DOM
            setTimeout(() => {
                // Actualizar representación gráfica
                beltStripeDisplay.className = `belt-stripe-display ${data.className}`;
                beltStripeDisplay.style.setProperty('--stripe-color', data.stripeColor);

                // Actualizar textos
                beltGrade.textContent = data.grade;
                beltTitle.textContent = data.title;
                beltMeaningText.textContent = data.meaning;

                // Actualizar lista de requerimientos
                beltReqList.innerHTML = '';
                data.requirements.forEach(req => {
                    const li = document.createElement('li');
                    li.textContent = req;
                    beltReqList.appendChild(li);
                });
            }, 100);
        });
    });


    // ==========================================
    // 4. FORMULARIO DE RESERVAS CON VALIDACIÓN Y ÉXITO
    // ==========================================
    const bookingForm = document.getElementById('bookingForm');
    const formSuccessState = document.getElementById('formSuccessState');
    const btnResetForm = document.getElementById('btnResetForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('formSpinner');

    // Elementos del input
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const programSelect = document.getElementById('programSelect');

    const showError = (inputElement, errorElementId) => {
        const group = inputElement.closest('.input-group');
        if (group) group.classList.add('error');
    };

    const clearErrors = () => {
        const groups = document.querySelectorAll('.input-group');
        groups.forEach(g => g.classList.remove('error'));
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        // Validación básica de número telefónico (mínimo 8 dígitos)
        return phone.trim().length >= 8 && /^\d+$/.test(phone.trim());
    };

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let isValid = true;

            // Validar Nombre
            if (!nameInput.value.trim()) {
                showError(nameInput);
                isValid = false;
            }

            // Validar Email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                showError(emailInput);
                isValid = false;
            }

            // Validar Teléfono
            if (!phoneInput.value.trim() || !validatePhone(phoneInput.value)) {
                showError(phoneInput);
                isValid = false;
            }

            // Validar Selección de Programa
            if (!programSelect.value) {
                showError(programSelect);
                isValid = false;
            }

            // Si pasa validaciones, simular envío
            if (isValid) {
                // Mostrar Spinner y deshabilitar botón
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.btn-text');
                btnText.style.opacity = '0.3';
                spinner.style.display = 'block';

                // Simular llamada de API (1.5 segundos)
                setTimeout(() => {
                    // Restaurar botón
                    submitBtn.disabled = false;
                    btnText.style.opacity = '1';
                    spinner.style.display = 'none';

                    // Ocultar formulario, mostrar pantalla de éxito
                    bookingForm.style.display = 'none';
                    formSuccessState.style.display = 'flex';
                }, 1500);
            }
        });
    }

    // Botón para restablecer el formulario de inscripción
    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            bookingForm.reset();
            clearErrors();
            formSuccessState.style.display = 'none';
            bookingForm.style.display = 'block';
        });
    }
});

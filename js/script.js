document.addEventListener('DOMContentLoaded', function() {
    // --- CRONÓMETRO (Sin cambios, ya funciona) ---
    const countdownElement = document.getElementById('countdown-inline');
    if (countdownElement) {
        const weddingDate = new Date('2025-08-31T16:00:00').getTime();
        const timer = setInterval(function() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(timer);
                countdownElement.innerHTML = "¡Llegó el gran día!";
                return;
            }
            const target = new Date('2025-08-31T16:00:00');
            let current = new Date();
            let months = (target.getFullYear() - current.getFullYear()) * 12 - current.getMonth() + target.getMonth();
            let days = target.getDate() - current.getDate();
            if (days < 0) {
                months--;
                days += new Date(current.getFullYear(), current.getMonth(), 0).getDate();
            }
            if (target.getTime() < current.getTime()) months = days = 0;
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const format = (num) => num < 10 ? '0' + num : num;
            countdownElement.innerHTML = 
                `${months}M:${days}D:${format(hours)}:${format(minutes)}:${format(seconds)}`;
        }, 1000);
    }

        // --- LÓGICA DE MODALS ---
    const loadingScreen = document.getElementById('loading-screen');
    const archLeft = document.querySelector('.loading-arch-left');
    const archRight = document.querySelector('.loading-arch-right');
    const shields = document.querySelector('.loading-shields');
    const rsvpModal = document.getElementById('rsvpModal');
    const giftsModal = document.getElementById('giftsModal');
    const albumModal = document.getElementById('albumModal');
    const openGiftsBtn = document.getElementById('openGiftsModal');
    const openRsvpBtn = document.getElementById('openRsvpModal');
    const openAlbumBtn = document.getElementById('openAlbumModal');
    const closeButtons = document.querySelectorAll('.close-button');

        // Función para simular la carga de la página
    function simulateLoading() {
        return new Promise((resolve) => {
            let loaded = 0;
            const interval = setInterval(() => {
                loaded += 10;
                if (loaded >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    // Función para aplicar la animación de carga
    async function loadPage() {
        await simulateLoading();
        archLeft.style.animation = 'load 2s forwards';
        archRight.style.animation = 'load 2s forwards';
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar a que se completen las animaciones de carga
        archLeft.style.animation = 'open-left-door 2s forwards';
        archRight.style.animation = 'open-right-door 2s forwards';
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar a que se completen las animaciones de apertura de puertas
        loadingScreen.style.animation = 'flash 0.5s forwards';
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar a que se complete el efecto de flash
        shields.style.opacity = '1';
        await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar a que se muestren los escudos
        shields.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar a que se oculten los escudos
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar a que se oculte la pantalla de carga
        loadingScreen.style.display = 'none';
    }

    loadPage();


    // Función para cerrar todos los modales
    function closeModal() {
        if (rsvpModal) rsvpModal.style.display = 'none';
        if (giftsModal) giftsModal.style.display = 'none';
        if (albumModal) albumModal.style.display = 'none';
    }

    // Asignar el cierre a todos los botones con la 'x'
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Cerrar al hacer clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == giftsModal || event.target == albumModal) {
            closeModal();
        }
    });

    // Cerrar al hacer clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == rsvpModal || event.target == giftsModal || event.target == albumModal) {
            closeModal();
        }
    });

    // Abrir modal de Obsequios
    if (openGiftsBtn) {
        openGiftsBtn.addEventListener('click', function() {
            if (giftsModal) {
                giftsModal.style.display = 'flex';
            }
        });
    }

    // Abrir modal de Confirmar Asistencia
    if (openRsvpBtn) {
        openRsvpBtn.addEventListener('click', function() {
            if (rsvpModal) {
                rsvpModal.style.display = 'flex';
            }
        });
    }

    // Abrir modal de Álbum de Fotos
    if (openAlbumBtn) {
        openAlbumBtn.addEventListener('click', function() {
            if (albumModal) {
                albumModal.style.display = 'flex';
            }
        });
    }

    // --- LÓGICA DEL FORMULARIO DE RSVP (Sin cambios) ---
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, { method: form.method, body: formData });
                if (response.ok) {
                    document.getElementById('rsvpFormContainer').style.display = 'none';
                    document.getElementById('thankYouMessage').style.display = 'block';
                } else {
                    alert('Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.');
                }
            } catch (error) {
                alert('Hubo un problema de conexión. Por favor, inténtalo de nuevo.');
            }
        });
    }

    // --- CONTROL DE VOLUMEN Y REPRODUCCIÓN DE MÚSICA ---
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.25;
        let musicPlayed = false;
        async function playMusic() {
            if (!musicPlayed) {
                try {
                    await backgroundMusic.play();
                    musicPlayed = true;
                } catch (error) {
                    console.log('La reproducción automática fue bloqueada por el navegador. Se requiere interacción del usuario.');
                }
            }
        }
        document.body.addEventListener('click', playMusic, { once: true });
        document.body.addEventListener('touchstart', playMusic, { once: true });
    }

    // --- ANIMACIÓN DE ENTRADA AL BAJAR ---
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
});


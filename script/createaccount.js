document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RESTRICCIÓN DE FECHA MÁXIMA (HOY)
    // ==========================================
    const inputCumple = document.getElementById('cumpleanos');
    if (inputCumple) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        inputCumple.max = `${yyyy}-${mm}-${dd}`;
    }


    // ==========================================
    // 2. LÓGICA DEL MULTI-STEP FORM Y NAVEGACIÓN
    // ==========================================
    const pages = document.querySelectorAll('form > .page');
    const steps = document.querySelectorAll('.progress-bar .step');
    let paginaActual = 0;
    let maxPasoAlcanzado = 0;

    function mostrarPagina(index) {
        pages.forEach((page, i) => {
            page.style.display = (i === index) ? 'block' : 'none';
        });
        paginaActual = index;
        actualizarBarraPasos();

        if (index === 3) { // Si llega a la página de confirmación (Paso 4)
            generarResumen();
        }
    }


    // ==========================================
    // 3. VALIDACIONES Y MENSAJES DE ERROR
    // ==========================================
    function validarPagina(index) {
        const paginaActualEl = pages[index];
        if (!paginaActualEl) return true;

        // Limpiar errores previos en esta página
        paginaActualEl.querySelectorAll('.error-msg').forEach(el => el.remove());
        let esValido = true;

        if (index === 0) {
            // Validar checkboxes del Paso 1
            const checkboxes = paginaActualEl.querySelectorAll('input[type="checkbox"]');
            const algunoMarcado = Array.from(checkboxes).some(cb => cb.checked);
            if (!algunoMarcado) {
                mostrarError(checkboxes[0].closest('.grupo-opciones'), "¡Hey, no seleccionaste ninguna opción!");
                esValido = false;
            }
        } else if (index === 1 || index === 2) {
            // Validar inputs y selects de datos personales y hábitos
            const inputs = paginaActualEl.querySelectorAll('input[required], select');
            inputs.forEach(input => {
                if (input.tagName === 'SELECT') {
                    if (input.value === "" || input.selectedIndex === 0 || input.options[input.selectedIndex]?.hasAttribute('hidden')) {
                        mostrarError(input, "¡Hey, no me llenaste este campo!");
                        esValido = false;
                    }
                } else {
                    if (!input.value.trim()) {
                        mostrarError(input, "¡Hey, no me llenaste este campo!");
                        esValido = false;
                    }
                }
            });
        }
        return esValido;
    }

    function mostrarError(elementoRef, mensaje) {
        const msg = document.createElement('div');
        msg.className = 'error-msg';
        msg.style.color = 'red';
        msg.style.fontSize = '12px';
        msg.style.marginBottom = '5px';
        msg.style.fontWeight = 'bold';
        msg.innerText = mensaje;

        const contenedor = elementoRef.closest('.input-group') || elementoRef.parentElement;
        contenedor.insertBefore(msg, contenedor.firstChild);
    }


    // ==========================================
    // 4. CONTROL DE LA BARRA LATERAL (PROGRESS BAR)
    // ==========================================
    function actualizarBarraPasos() {
        steps.forEach((step, i) => {
            if (i <= maxPasoAlcanzado) {
                step.style.opacity = '1';
                step.style.cursor = 'pointer';
            } else {
                step.style.opacity = '0.5';
                step.style.cursor = 'not-allowed';
            }
        });
    }

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (index <= maxPasoAlcanzado) {
                mostrarPagina(index);
            }
        });
    });


    // ==========================================
    // 5. BOTONES DE ACCIÓN (CONTINUAR, VOLVER, ENVIAR)
    // ==========================================
    document.querySelectorAll('.btn-continuar').forEach((btn) => {
        if (btn.id === 'btn-volver' || btn.id === 'btn-enviar') return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validarPagina(paginaActual)) {
                if (paginaActual < pages.length - 1) {
                    paginaActual++;
                    if (paginaActual > maxPasoAlcanzado) {
                        maxPasoAlcanzado = paginaActual;
                    }
                    mostrarPagina(paginaActual);
                }
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-volver') {
            e.preventDefault();
            mostrarPagina(3);
        }
        if (e.target && e.target.id === 'btn-enviar') {
            e.preventDefault();
            window.location.href = "home.html"
        }
    });

    mostrarPagina(0);


    // ==========================================
    // 6. GENERACIÓN DINÁMICA DEL RESUMEN (PASO 4)
    // ==========================================
    function generarResumen() {
        const contenedor = document.getElementById('resumen-container');
        if (!contenedor) return;
        contenedor.innerHTML = '';

        const checkboxes = document.querySelectorAll('.page:nth-of-type(1) input[type="checkbox"]');
        let objetivosSeleccionados = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const labelText = document.querySelector(`label[for="${cb.id}"] span`)?.textContent || cb.value;
                objetivosSeleccionados.push(labelText);
            }
        });

        const fecha = document.querySelector('input[type="date"]')?.value || 'No especificado';
        const edad = document.querySelectorAll('input[type="number"]')[0]?.value || 'No especificado';
        const altura = document.querySelectorAll('input[type="number"]')[1]?.value || 'No especificado';
        const peso = document.querySelectorAll('input[type="number"]')[2]?.value || 'No especificado';
        const pais = document.getElementById('select-pais')?.selectedOptions[0]?.text || 'No especificado';
        const direccion = document.getElementById('input-direccion')?.value || 'No especificado';
        const generoSelect = document.querySelectorAll('.page:nth-of-type(2) select')[0];
        const genero = generoSelect?.selectedIndex > 0 ? generoSelect.value : 'No especificado';

        const selectsHabitos = document.querySelectorAll('.page:nth-of-type(3) select');
        const ejercicio = selectsHabitos[0]?.selectedOptions[0]?.text || 'No especificado';
        const restaurantes = selectsHabitos[1]?.selectedOptions[0]?.text || 'No especificado';
        const saludables = selectsHabitos[2]?.selectedOptions[0]?.text || 'No especificado';
        const recetas = selectsHabitos[3]?.selectedOptions[0]?.text || 'No especificado';
        const recetasSaludables = selectsHabitos[4]?.selectedOptions[0]?.text || 'No especificado';
        const vidaSaludable = selectsHabitos[5]?.selectedOptions[0]?.text || 'No especificado';
        const alergias = selectsHabitos[6]?.selectedOptions[0]?.text || 'No especificado';

        const items = [
            { label: "Objetivos en Futness", valor: objetivosSeleccionados.length > 0 ? objetivosSeleccionados.join(', ') : 'Ninguno seleccionado', target: 0 },
            { label: "Fecha de nacimiento", valor: fecha, target: 1 },
            { label: "Edad", valor: edad, target: 1 },
            { label: "Estatura", valor: altura + " metros", target: 1 },
            { label: "Peso", valor: peso + " Kilos", target: 1 },
            { label: "País", valor: pais, target: 1 },
            { label: "Dirección", valor: direccion, target: 1 },
            { label: "Género", valor: genero, target: 1 },
            { label: "Ejercicio físico", valor: ejercicio, target: 2 },
            { label: "Comer en restaurantes", valor: restaurantes, target: 2 },
            { label: "Opciones saludables", valor: saludables, target: 2 },
            { label: "Seguir recetas", valor: recetas, target: 2 },
            { label: "Recetas saludables", valor: recetasSaludables, target: 2 },
            { label: "Vida saludable actual", valor: vidaSaludable, target: 2 },
            { label: "Alergias / Restricciones", valor: alergias, target: 2 }
        ];

        items.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 10px; padding: 8px 12px; background: #fdfdfd; border: 1px solid #eee; border-radius: 6px;";

            div.innerHTML = `
                <div style="flex-grow: 1;">
                    <strong style="font-size: 13px; color: #555; display: block;">${item.label}:</strong>
                    <span style="font-size: 14px; color: #222;">${item.valor}</span>
                </div>
            `;

            const btnEditar = document.createElement('button');
            btnEditar.type = "button";
            btnEditar.innerText = "Editar";
            btnEditar.style.cssText = "padding: 5px 10px; cursor: pointer; flex-shrink: 0;";
            btnEditar.onclick = () => mostrarPagina(item.target);

            div.appendChild(btnEditar);
            contenedor.appendChild(div);
        });
    }

    // ==========================================
    // 7. AUTOCOMPLETADO DE DIRECCIONES (Global + Dinámico por País)
    // ==========================================
    const inputDireccion = document.getElementById('input-direccion');
    const listaSugerencias = document.getElementById('lista-sugerencias');
    const selectPais = document.getElementById('select-pais'); // Referencia al select de países
    let timeoutId = null;

    if (inputDireccion && listaSugerencias) {
        inputDireccion.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            // Limpiar sugerencias si escriben menos de 3 caracteres
            if (query.length < 3) {
                listaSugerencias.innerHTML = '';
                return;
            }

            // Obtener el código de país seleccionado (ej: "MX", "AR", "ES", etc.) y pasarlo a minúsculas
            // Si no ha seleccionado ninguno, se queda vacío para buscar a nivel mundial
            const codigoPais = selectPais && selectPais.value ? selectPais.value.toLowerCase() : '';

            // Evitar peticiones excesivas usando debounce (espera 300ms)
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // Construimos la URL de Nominatim de forma global
                let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;

                // Si el usuario ya eligió un país, limitamos o sesgamos la búsqueda hacia allá para mayor precisión
                if (codigoPais) {
                    url += `&countrycodes=${codigoPais}`;
                }

                fetch(url, {
                    headers: {
                        'Accept-Language': 'es'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        listaSugerencias.innerHTML = '';

                        if (data.length === 0) return;

                        data.forEach(lugar => {
                            const item = document.createElement('div');
                            item.className = 'sugerencia-item';
                            item.innerText = lugar.display_name;

                            // Al hacer clic en una sugerencia, se rellena el input y se limpia la lista
                            item.addEventListener('click', () => {
                                inputDireccion.value = lugar.display_name;
                                listaSugerencias.innerHTML = '';
                            });

                            listaSugerencias.appendChild(item);
                        });
                    })
                    .catch(error => console.error('Error buscando dirección:', error));
            }, 300);
        });

        // Ocultar las sugerencias si el usuario hace clic fuera del input o la lista
        document.addEventListener('click', (e) => {
            if (!inputDireccion.contains(e.target) && !listaSugerencias.contains(e.target)) {
                listaSugerencias.innerHTML = '';
            }
        });
    }
});
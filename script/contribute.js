document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria') || 'comida';
    const tipo = urlParams.get('tipo') || 'receta';

    document.getElementById('page-main-title').textContent = `Creando tu ${tipo} (${categoria})`;

    // Control de Acordeones
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isOpen = currentItem.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item.classList.contains('active') && item !== currentItem) {
                    item.classList.remove('active');
                    if (!item.dataset.validated) item.classList.add('invalid');
                }
            });

            if (!isOpen) {
                currentItem.classList.add('active');
                currentItem.classList.remove('invalid');
            } else {
                currentItem.classList.remove('active');
                if (!currentItem.dataset.validated) item.classList.add('invalid');
            }
        });
    });

    document.querySelector('.accordion-item').classList.add('active');
});

// Validación de dimensiones óptimas de la imagen en tiempo real
function validarMedidasImagen(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const ancho = img.width;
                const alto = img.height;
                
                // Sugerencia ideal: 1200x800, permitiendo un margen de flexibilidad o advirtiendo si está muy baja/desproporcionada
                if (ancho < 600 || alto < 400) {
                    alert(`Advertencia: La imagen seleccionada es muy pequeña (${ancho}x${alto}px). Para que se vea perfecta en la plataforma, te recomendamos que sea de al menos 1200x800 píxeles.`);
                }
            };
        };
        reader.readAsDataURL(file);
    }
}

// Gestión Dinámica de Ingredientes
function agregarIngrediente() {
    const container = document.getElementById('ingredientes-list');
    const count = container.querySelectorAll('.ingredient-row').length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="number" class="ing-cant" placeholder="1" min="0" step="any" required>
        <input type="text" class="ing-nombre" placeholder="Ingrediente #${count}" required>
        <select class="ing-unidad">
            <option value="Ud">Unidad (Ud)</option>
            <option value="Pz">Pizca (Pz)</option>
            <option value="Tz">Taza (Tz)</option>
            <option value="ml">Mililitros (ml)</option>
            <option value="L">Litros (L)</option>
            <option value="g">Gramos (g)</option>
            <option value="Kg">Kilogramos (Kg)</option>
            <option value="Cd">Cucharada (Cd)</option>
            <option value="cd">Cucharadita (cd)</option>
        </select>
        <button type="button" class="btn-remove-row" onclick="removerFila(this)">✕</button>
    `;
    container.appendChild(newRow);
}

// Gestión Dinámica de Pasos de Preparación (Estilo Píldora de la captura)
function agregarPasoPreparacion() {
    const container = document.getElementById('preparacion-steps-list');
    const totalSteps = container.querySelectorAll('.prep-step-row').length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'prep-step-row';
    newRow.innerHTML = `
        <input type="text" class="prep-step-input" placeholder="Paso #${totalSteps}" required>
        <button type="button" class="btn-remove-row" onclick="removerFila(this)">✕</button>
    `;
    container.appendChild(newRow);
}

function removerFila(btn) {
    const row = btn.parentElement;
    const parentContainer = row.parentElement;
    if (parentContainer.children.length > 1) {
        row.remove();
        // Opcional: Reenumerar placeholders si deseas
    } else {
        alert('Debes mantener al menos un elemento.');
    }
}

// Validación de cada paso y estructuración de datos
const pasosValidados = { 1: false, 2: false, 3: false, 4: false, 5: false };

function validarPaso(numPaso) {
    let esValido = true;
    const item = document.querySelector(`.accordion-item[data-step="${numPaso}"]`);

    if (numPaso === 1) {
        if (!document.getElementById('nombre-plato').value.trim()) esValido = false;
    } else if (numPaso === 2) {
        if (document.getElementById('foto-plato').files.length === 0) esValido = false;
    } else if (numPaso === 3) {
        document.querySelectorAll('.ing-nombre').forEach((input, index) => {
            if (!input.value.trim() || !document.querySelectorAll('.ing-cant')[index].value) esValido = false;
        });
    } else if (numPaso === 4) {
        if (!document.getElementById('info-nutricional').value.trim()) esValido = false;
    } else if (numPaso === 5) {
        document.querySelectorAll('.prep-step-input').forEach(input => {
            if (!input.value.trim()) esValido = false;
        });
    }

    if (esValido) {
        item.classList.remove('invalid');
        item.classList.add('valid');
        item.dataset.validated = "true";
        pasosValidados[numPaso] = true;

        document.getElementById(`cert-step-${numPaso}`).classList.add('completed');

        item.classList.remove('active');
        const siguienteItem = document.querySelector(`.accordion-item[data-step="${numPaso + 1}"]`);
        if (siguienteItem) siguienteItem.classList.add('active');

        verificarFormularioCompleto();
    } else {
        item.classList.remove('valid');
        item.classList.add('invalid');
        alert('Por favor, completa correctamente los campos requeridos de este paso.');
    }
}

function verificarFormularioCompleto() {
    if (Object.values(pasosValidados).every(v => v === true)) {
        document.getElementById('btn-enviar-final').removeAttribute('disabled');
        document.getElementById('cert-step-6').classList.add('completed');
    }
}

// Empaquetar y enviar al Administrador
function enviarRecetaAdmin() {
    // Recolectar todos los pasos de preparación dinámicos en un arreglo para el JSON
    const pasosArray = [];
    document.querySelectorAll('.prep-step-input').forEach(input => {
        pasosArray.push(input.value.trim());
    });

    const recetaData = {
        nombre: document.getElementById('nombre-plato').value.trim(),
        nutricion: document.getElementById('info-nutricional').value.trim(),
        preparacionPasos: pasosArray, // Array estructurado para el JSON con los pasos modulares
        dimensionesImagenSugerida: "1200x800",
        estado: 'pendiente',
        fecha: new Date().toISOString()
    };

    let pendientes = JSON.parse(localStorage.getItem('admin_pendientes') || '[]');
    pendientes.push(recetaData);
    localStorage.setItem('admin_pendientes', JSON.stringify(pendientes));

    alert('¡Receta enviada con éxito! Ya se encuentra disponible en el panel de administración para su revisión.');
    window.location.href = 'home.html';
}
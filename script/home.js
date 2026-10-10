document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const searchCollapsedBtn = document.querySelector('.search-collapsed-btn');
    const searchInput = document.querySelector('.search-input');

    // Cargar estado previo guardado en localStorage
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    if (isCollapsed) {
        body.classList.add('sidebar-collapsed');
    }

    // Alternar el estado colapsado al hacer clic en el botón principal
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            body.classList.toggle('sidebar-collapsed');
            const collapsedState = body.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebar_collapsed', collapsedState);
        });
    }

    // Abrir el menú al hacer clic en la lupa cuando está colapsado
    if (searchCollapsedBtn) {
        searchCollapsedBtn.addEventListener('click', () => {
            body.classList.remove('sidebar-collapsed');
            localStorage.setItem('sidebar_collapsed', 'false');
            
            // Enfocar automáticamente el input de búsqueda tras abrirse la barra
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 200);
        });
    }

    // Soporte para navegadores sin commandfor nativo en modales
    const buttonsWithCommand = document.querySelectorAll('[command="show-modal"]');
    buttonsWithCommand.forEach(button => {
        button.addEventListener('click', () => {
            const dialogId = button.getAttribute('commandfor');
            if (dialogId) {
                const dialog = document.getElementById(dialogId);
                if (dialog && typeof dialog.showModal === 'function') {
                    dialog.showModal();
                }
            }
        });
    });
});
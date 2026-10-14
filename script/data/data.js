// data.js - Manejo de datos, sincronización con data.json y gestión de tags

async function getItems() {
    try {
        // Usamos la ruta exacta donde tienes tu archivo JSON con anti-caché
        let response = await fetch('data.json?t=' + Date.now());
        if (!response.ok) throw new Error('No se pudo cargar el archivo data.json');
        
        let jsonItems = await response.json();
        let stored = localStorage.getItem('healthItems');
        let localItems = stored ? JSON.parse(stored) : [];

        // Filtramos los elementos creados por usuarios normales (que no son admin)
        let userItems = localItems.filter(item => item.author !== "admin");

        // Fusionamos: El JSON del admin manda (si se borra algo ahí, desaparece), y conservamos lo del usuario
        let finalItems = [...jsonItems, ...userItems];

        localStorage.setItem('healthItems', JSON.stringify(finalItems));
        return finalItems;

    } catch (error) {
        console.error("Error al sincronizar los datos:", error);
        return JSON.parse(localStorage.getItem('healthItems')) || [];
    }
}

async function saveItem(newItem) {
    let items = await getItems();
    
    if (!newItem.author || newItem.author === "admin") {
        newItem.author = "usuario";
    }
    
    // Aseguramos que siempre tenga etiquetas
    if (!newItem.tags || !Array.isArray(newItem.tags)) {
        newItem.tags = ["general"];
    }
    
    items.push(newItem);
    localStorage.setItem('healthItems', JSON.stringify(items));
}
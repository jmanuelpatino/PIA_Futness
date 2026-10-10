// data.js - Manejo de datos y almacenamiento local con control de versión
const DATA_VERSION = "v4"; // Sube esto (v3, v4...) solo cuando quieras forzar nuevos elementos base

const initialItems = [
    {
        id: "1",
        title: "Rutina de Fuerza Full Body",
        category: "ejercicio",
        type: "rutina",
        description: "Entrenamiento completo de 45 minutos para todo el cuerpo sin pesas.",
        details: "Cómo hacerlo: Realiza 4 series de 15 sentadillas, 12 flexiones y 30 segundos de plancha. Buenas prácticas: Mantén la espalda recta.",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "2",
        title: "Salmón al Horno con Verduras",
        category: "comida",
        type: "receta",
        description: "Una cena rica en omega-3, ligera y muy fácil de preparar.",
        details: "Ingredientes: Filete de salmón, brócoli, zanahoria, aceite de oliva. Preparación: Hornear a 200°C por 20 minutos.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "3",
        title: "Green Bowl & Co.",
        category: "comida",
        type: "restaurante",
        description: "Restaurante de comida saludable, tazones orgánicos y opciones veganas.",
        details: "Horarios: Lunes a Sábado 8:00 AM - 8:00 PM. Calificación: 4.8/5 ⭐.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "4",
        title: "Donde Mama Ines",
        category: "comida",
        type: "restaurante",
        description: "Comida casera tradicional y saludable.",
        details: "Horarios: Lunes a Domingo 11:00 AM - 4:00 PM. Calificación: 4.9/5 ⭐.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "5",
        title: "Fit Burger Artesanal",
        category: "comida",
        type: "restaurante",
        description: "Hamburguesas saludables con pan de masa madre y carne orgánica.",
        details: "Horarios: Martes a Domingo 1:00 PM - 10:00 PM. Calificación: 4.7/5 ⭐.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "6",
        title: "Yoga y Movilidad Matutina",
        category: "ejercicio",
        type: "rutina",
        description: "Sesión de estiramientos para despertar el cuerpo y relajar la columna.",
        details: "Cómo hacerlo: 20 minutos de posturas fluidas enfocadas en la respiración.",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "7",
        title: "Ensalada César con Pollo Grill",
        category: "comida",
        type: "receta",
        description: "Clásico saludable rico en proteínas y aderezo ligero de yogur.",
        details: "Ingredientes: Lechuga romana, pechuga a la plancha, crutones integrales y queso parmesano.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "8",
        title: "Smoothie Bowl de Frutos Rojos",
        category: "coda",
        type: "receta",
        description: "Desayuno energizante lleno de antioxidantes y fibra.",
        details: "Ingredientes: Arándanos, fresas congeladas, banano y leche vegetal.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "9",
        title: "Entrenamiento Core Abdominales",
        category: "ejercicio",
        type: "rutina",
        description: "Fortalece tu zona media con este circuito rápido.",
        details: "Cómo hacerlo: Planchas, elevaciones de piernas y bicicleta por 15 minutos.",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    },
    {
        id: "10",
        title: "Pam pam",
        category: "otro",
        type: "rutina",
        description: "Fortalece tu zona media con este circuito rápido.",
        details: "Cómo hacerlo: Planchas, elevaciones de piernas y bicicleta por 15 minutos.",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        author: "admin",
        status: "aprobado"
    }
];

function getItems() {
    let currentVersion = localStorage.getItem('healthVersion');
    let stored = localStorage.getItem('healthItems');

    // Si no existen datos o cambió la versión en el código, inicializamos con los nuevos datos base
    if (!stored || currentVersion !== DATA_VERSION) {
        localStorage.setItem('healthItems', JSON.stringify(initialItems));
        localStorage.setItem('healthVersion', DATA_VERSION);
        return initialItems;
    }
    
    return JSON.parse(stored);
}

function saveItem(newItem) {
    let items = getItems();
    items.push(newItem);
    localStorage.setItem('healthItems', JSON.stringify(items));
}
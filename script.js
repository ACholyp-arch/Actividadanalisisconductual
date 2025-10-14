const nombres = [
    "Emili Marcel Cabrera Flores",
    "Dulce Naomy Calderon Gonzalez",
    "Jennifer Estefania Chajon Barrios",
    "Enrique Cifuentes Bauer",
    "Santiago Del Rio Mendez",
    "Carlos Rafael Fernandez Valdes",
    "Martin Figueroa Tavares",
    "Esteban Renato Fratta Torres",
    "Maria Fernanda Garcia Barrios",
    "Julian Garcia Fernandez de la Torre",
    "Andrea Michelle Lacota Martinez",
    "Maria Amalia Leclair Rodriguez",
    "Fatima Anai Lopez Castellanos",
    "Maria Andrea Marinelli Toruno",
    "Ana Lucia Morales Paiz",
    "Ana Lucia Munoz Turcios",
    "Martin Leonardo Rivera Grajeda",
    "Jose Mariano Rodriguez Rios",
    "Ximena Santizo Murua",
    "Isabel Siliezar Rodas",
    "Jeanne Marie Wheelock"
];

const casos = {
    "Hacer cumplidos": [
        "Elogia el esfuerzo y no solo el resultado. Ejemplo: En vez de 'qué inteligente eres', di 'se nota que le dedicas tiempo y disciplina'.",
        "Haz un cumplido inesperado relacionado a valores o personalidad. Ejemplo: 'Admiro tu paciencia con los demás'."
    ],
    "Recibir cumplidos": [
        "Responde con gratitud y retribución sincera. Ejemplo: 'Gracias, tú también tienes un estilo único para explicar las cosas'.",
        "Evita invalidar el cumplido y acepta con humildad. Ejemplo MAL: 'Nah, no es nada'. Ejemplo BIEN: 'Gracias, me alegra que lo notes'."
    ]
};

function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generarParejas() {
    let copia = mezclar([...nombres]);
    let resultado = [];

    for (let i = 0; i < copia.length; i += 2) {
        if (i + 1 < copia.length) {
            const rol1 = Math.random() < 0.5 ? "Hacer cumplidos" : "Recibir cumplidos";
            const rol2 = rol1 === "Hacer cumplidos" ? "Recibir cumplidos" : "Hacer cumplidos";

            resultado.push({
                persona1: copia[i],
                rol1: rol1,
                caso1: casos[rol1][Math.floor(Math.random() * casos[rol1].length)],
                persona2: copia[i + 1],
                rol2: rol2,
                caso2: casos[rol2][Math.floor(Math.random() * casos[rol2].length)]
            });
        } else {
            resultado.push({ grupoExtra: copia[i], nota: "Esta persona queda para un grupo de 3." });
        }
    }

    console.log(resultado);
    return resultado;
}

// Llamar esta función cuando presiones un botón
generarParejas();

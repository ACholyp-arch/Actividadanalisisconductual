// ----- Datos -----
const NOMBRES = [
  "Emili Marcel Cabrera Flores",
  "Dulce Naomy Calderón Gonzalez",
  "Jennifer Estefanía Chajón Barrios",
  "Enrique Cifuentes Bauer",
  "Santiago Del Río Méndez",
  "Carlos Rafael Fernández Valdés",
  "Martin Figueroa Tavares",
  "Esteban Renato Fratta Torres",
  "María Fernanda Garcia Barrios",
  "Julian García Fernández de la Torre",
  "Andrea Michelle Lacota Martínez",
  "Maria Amalia Leclair Rodriguez",
  "Fátima Anaí López Castellanos",
  "Maria Andrea Marinelli Toruño",
  "Ana Lucía Morales Paiz",
  "Ana Lucía Muñoz Turcios",
  "Martin Leonardo Rivera Grajeda",
  "José Mariano Rodríguez Rios",
  "Ximena Santizo Murúa",
  "Isabel Siliézar Rodas",
  "Jeanne Marie Wheelock"
];

// Casos complejos: para cada rol, una lista de objetos con "si" y "no"
const CASOS = {
  "Hacer cumplidos": [
    {
      si: "Elogia el proceso y el esfuerzo con detalle: 'Se nota que estudiaste esto a fondo; la forma en que conectaste X con Y fue clara y consistente.'",
      no: "Elogio centrado solo en la apariencia en contexto profesional: 'Qué bien te ves' durante una presentación formal sin valorar el contenido."
    },
    {
      si: "Haz cumplidos que empoderen: 'Tu comentario ayudó a que el grupo avanzara —gracias por tu claridad y por preguntar las cosas difíciles.'",
      no: "Comparar a la persona con otros para halagarla: 'No como X, tú sí puedes…' (genera competencia y tensión)."
    },
    {
      si: "Se específico, relaciona el cumplido con una acción concreta: 'Tu resumen incluyó tres datos clave que me hicieron entender el argumento.'",
      no: "Elogio vago y sobrecargado: 'Eres increíble' sin explicar por qué (suena poco sincero)."
    }
  ],
  "Recibir cumplidos": [
    {
      si: "Acepta con gratitud y añade reciprocidad: 'Gracias, me alegra que lo notaras. Tú también explicaste muy bien el punto B.'",
      no: "Invalidar inmediatamente: 'Nah, eso no es nada' —minimiza la intención de quien da el cumplido."
    },
    {
      si: "Transforma en diálogo: agradecer y pedir detalle si procede: 'Gracias —¿qué parte te pareció más útil?'",
      no: "Falsa modestia auto-devaluativa: 'Por suerte tuve tiempo, yo no sirvo para esto' (incomoda y quita autenticidad)."
    },
    {
      si: "Acepta y comparte el crédito cuando corresponde: 'Gracias, trabajamos en equipo y tu aporte fue parte.'",
      no: "Respuestas que convierten el cumplido en crítica: 'Gracias... aunque igual hubo errores' (desvía la atención)."
    }
  ]
};

// ----- Helpers -----

// Normaliza texto (quita tildes, mayúsculas, espacios extra) — útil si alguna vez necesitas búsqueda
function normalizarTexto(s){
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
}

// Fisher–Yates shuffle (robusto)
function shuffleArray(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Selecciona aleatorio
function randomChoice(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

// Tira dados con animación: devuelve una promesa que se resuelve cuando termina
function rollDiceAnimation(el, duration = 900){
  return new Promise(resolve => {
    const start = Date.now();
    const frames = ["🎲","⚀","⚁","⚂","⚃","⚄","⚅"];
    const iv = setInterval(()=>{
      el.textContent = frames[Math.floor(Math.random() * frames.length)];
      el.style.transform = `rotate(${(Math.random()-0.5)*30}deg) scale(${1 + Math.random()*0.08})`;
    }, 80);
    setTimeout(() => {
      clearInterval(iv);
      el.style.transform = "rotate(0deg) scale(1)";
      resolve();
    }, duration);
  });
}

// Crea tarjeta DOM para una persona
function createCard(person, role, casoSi, casoNo, diceEl){
  const card = document.createElement("article");
  card.className = "card";

  const h = document.createElement("h3");
  h.textContent = person;
  card.appendChild(h);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span class="role">${role}</span> <span class="dice" aria-hidden="true">${diceEl}</span>`;
  card.appendChild(meta);

  const caseSi = document.createElement("div");
  caseSi.className = "case";
  caseSi.innerHTML = `<b>Cómo sí</b><div>${casoSi}</div>`;
  card.appendChild(caseSi);

  const caseNo = document.createElement("div");
  caseNo.className = "case";
  caseNo.style.marginTop = "8px";
  caseNo.innerHTML = `<b>Cómo no</b><div>${casoNo}</div>`;
  card.appendChild(caseNo);

  return card;
}

// ----- Lógica principal -----
const btn = document.getElementById("generateBtn");
const results = document.getElementById("results");
const status = document.getElementById("status");

btn.addEventListener("click", async () => {
  btn.disabled = true;
  status.textContent = "Mezclando nombres y tirando dados...";
  results.innerHTML = "";

  // Mezclar nombres
  const pool = shuffleArray(NOMBRES);

  // Formar pares (y posible trio)
  const pairs = [];
  for (let i = 0; i < pool.length; i += 2) {
    if (i + 1 < pool.length) {
      pairs.push([pool[i], pool[i+1]]);
    } else {
      // último impar
      pairs.push([pool[i]]); // marca grupo extra
    }
  }

  // Si el último es solo uno y hay al menos otro par, lo convertimos en trio con la última pareja
  if (pairs.length > 0 && pairs[pairs.length - 1].length === 1 && pairs.length >= 2) {
    const lastAlone = pairs.pop()[0];
    const lastPair = pairs.pop(); // tomar la última pareja
    pairs.push([ lastPair[0], lastPair[1], lastAlone ]); // trio
  }

  // Para cada par/trio: animación de "dado de pareja" y asignación de roles
  for (const group of pairs) {
    // contenedor visual para este grupo
    const groupContainer = document.createElement("div");
    groupContainer.className = "group";
    groupContainer.style.display = "contents";
    results.appendChild(groupContainer);

    // crear y tirar un dado visible para efecto (uno por grupo)
    const diceVisual = document.createElement("span");
    diceVisual.className = "dice";
    diceVisual.textContent = "🎲";
    // insert temporary placeholder card that will be replaced after roll
    const placeholder = document.createElement("div");
    placeholder.className = "card";
    placeholder.innerHTML = `<div style="display:flex;align-items:center;gap:10px">
      <div style="font-weight:700">Generando...</div><div class="dice">${diceVisual.textContent}</div>
    </div>`;
    results.appendChild(placeholder);

    // animar
    await rollDiceAnimation(diceVisual, 900);
    // decide roles inside group:
    // pair: assign randomly who hace/recibe (one each)
    // trio: assign roles randomly but ensure at least one Hacer and one Recibir
    let assignments = [];
    if (group.length === 2) {
      const firstIsHacer = Math.random() < 0.5;
      assignments = [
        { person: group[0], role: firstIsHacer ? "Hacer cumplidos" : "Recibir cumplidos" },
        { person: group[1], role: firstIsHacer ? "Recibir cumplidos" : "Hacer cumplidos" }
      ];
    } else if (group.length === 3) {
      // crear roles aleatorios y garantizar al menos uno de cada
      const rolesPossible = ["Hacer cumplidos","Recibir cumplidos"];
      assignments = group.map(p => ({ person: p, role: randomChoice(rolesPossible) }));
      const rolesSet = new Set(assignments.map(a => a.role));
      if (rolesSet.size === 1) {
        // todos salieron iguales: corregir forzando un cambio en el tercero
        assignments[2].role = assignments[0].role === "Hacer cumplidos" ? "Recibir cumplidos" : "Hacer cumplidos";
      }
    } else if (group.length === 1) {
      // caso borde (solo una persona total)
      assignments = [{ person: group[0], role: randomChoice(["Hacer cumplidos","Recibir cumplidos"]) }];
    }

    // reemplazar placeholder por tarjetas individuales del grupo
    placeholder.remove();
    for (const a of assignments) {
      const caseObj = randomChoice(CASOS[a.role]);
      const card = createCard(a.person, a.role, caseObj.si, caseObj.no, diceVisual.textContent);
      results.appendChild(card);
    }

    // si es trio, mostrar nota
    if (group.length === 3) {
      const note = document.createElement("div");
      note.className = "trio-note";
      note.textContent = "Nota: grupo de 3. Roles balanceados (al menos un 'Hacer' y un 'Recibir').";
      results.appendChild(note);
    }
  }

  status.textContent = `Listo — se generaron ${results.querySelectorAll('.card').length} tarjetas.`;
  btn.disabled = false;
});

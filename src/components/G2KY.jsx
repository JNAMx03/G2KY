//flujo principal del quiz con animaciones y envío por EmailJS
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import FinalScreen from "./FinalScreen";
import { sendResultsEmail } from "../utils/email";

/* ----------------------------
   Lista de preguntas (editable)
   - id: identificador (puedes reordenar)
   - text: pregunta
   - type: 'single' | 'multi'
   - options: array de strings
   ---------------------------- */
const QUESTIONS = [
  { id: 1, text: "¿Cómo describirías tu estilo en el día a día?", type: "single", options: ["Casual", "Cute / tierno", "Elegante", "Minimalista", "Deportivo", "Alternativo"] },
  { id: 2, text: "¿Qué colores te gustan más para ropa o accesorios?", type: "multi", options: ["Negro", "Blanco", "Pasteles", "Colores fuertes", "Tonos tierra", "Metálicos"] },
  { id: 3, text: "¿Qué accesorios usas más?", type: "multi", options: ["Collares", "Aretes", "Manillas", "Anillos", "No uso muchos accesorios"] },
  { id: 4, text: "¿Qué prefieres cuando te dan un detalle?", type: "multi", options: ["Algo útil", "Algo bonito", "Algo sorpresa", "Algo hecho a mano", "Algo sentimental"] },
  { id: 5, text: "¿Qué te gusta hacer cuando tienes tiempo libre?", type: "multi", options: ["Ver series/películas", "Escuchar música", "Salir", "Dibujar", "Cocinar", "Dormir", "Jugar", "Leer"] },
  { id: 6, text: "¿Qué planes disfrutas más?", type: "single", options: ["Planes tranquilos en casa", "Salir a algún lugar", "Planes espontáneos", "Comer algo rico afuera"] },
  { id: 7, text: "¿Qué tipo de aromas te gustan más?", type: "single", options: ["Dulces", "Frescos", "Florales", "Cítricos", "Amaderados"] },
  { id: 8, text: "¿Qué estilo visual te gusta más?", type: "single", options: ["Minimalista", "Cute / kawaii", "Colorido", "Natural", "Elegante"] },
  { id: 9, text: "¿Qué ambientes te gustan más?", type: "multi", options: ["Acogedores", "Con luz suave", "Coloridos", "Naturales", "Ordenados", "Minimalistas"] },
  { id: 10, text: "¿Qué cosas te hacen sentir más cómoda?", type: "multi", options: ["Ropa suelta", "Ropa ajustada", "Colores neutros", "Accesorios sencillos", "Accesorios llamativos"] },
  { id: 11, text: "¿En qué te fijas más cuando te gusta algo nuevo?", type: "single", options: ["Cómo se ve", "Si es útil", "Si combina con lo que ya tengo", "Si es de buena calidad"] },
];

export default function G2KY() {
  // Estados de flujo
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0); // índice actual en QUESTIONS
  const [answers, setAnswers] = useState({}); // mapa: { questionId: [optionIndex, ...] }
  const [sending, setSending] = useState(false); // para mostrar loader mientras envía
  const questions = useMemo(() => QUESTIONS, []);

  // Handlers para seleccionar respuestas
  function toggleMulti(qId, optIndex) {
    setAnswers(prev => {
      const cur = prev[qId] ? [...prev[qId]] : [];
      const exists = cur.includes(optIndex);
      const next = exists ? cur.filter(i => i !== optIndex) : [...cur, optIndex];
      return { ...prev, [qId]: next };
    });
  }

  function setSingle(qId, optIndex) {
    setAnswers(prev => ({ ...prev, [qId]: [optIndex] }));
  }

  // Siguiente pregunta (valida que haya selección)
  function handleNext() {
    const q = questions[index];
    const a = answers[q.id] || [];
    if (a.length === 0) {
      // Mensaje no intrusivo (alert por simplicidad)
      alert("Selecciona al menos una opción ✨");
      return;
    }
    if (index + 1 >= questions.length) {
      // Llego al final -> enviar email y mostrar final screen
      handleFinish();
      return;
    }
    setIndex(i => i + 1);
  }

  function handleBack() {
    if (index === 0) {
      setStarted(false);
      return;
    }
    setIndex(i => Math.max(0, i - 1));
  }

  // Crear un resumen legible (string) y objeto de respuestas más descriptivo
  function buildResults() {
    // Ej: resumen legible para el email
    const humanReadable = questions.map(q => {
      const selected = answers[q.id] || [];
      const selectedText = selected.length === 0 ? "—" : selected.map(i => q.options[i]).join(", ");
      return `${q.id}. ${q.text}\n→ ${selectedText}`;
    }).join("\n\n");

    // Objeto con keys de pregunta y valores de texto (útil si quieres JSON)
    const answersObj = {};
    questions.forEach(q => {
      const selected = answers[q.id] || [];
      answersObj[q.id] = selected.map(i => q.options[i]);
    });

    return { humanReadable, answersObj };
  }

  // Maneja el final: envía email (EmailJS) y muestra pantalla final a Emily
  async function handleFinish() {
    setSending(true);
    const { humanReadable, answersObj } = buildResults();

    try {
      // Llamada al util que envía por EmailJS
      await sendResultsEmail({ summaryText: humanReadable, answersObj });

      // opcional: esperar medio segundo para que la UX sea suave
      setTimeout(() => {
        setSending(false);
        setFinished(true);
        setStarted(false);
      }, 500);
    } catch (err) {
      console.error("Error enviando email:", err);
      // si falla, igual mostramos final pero podrías reintentar
      setSending(false);
      setFinished(true);
      setStarted(false);
    }
  }

  // Reinicia quiz (desde pantalla final)
  function restart() {
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setStarted(true);
  }

  // computeSummary para mostrar un mensaje tierno en pantalla final (no revela todo)
  function computeSummaryForDisplay() {
    // Ejemplo simple: tomamos el primer estilo y colores (si existen)
    const firstStyle = (answers[1] && answers[1][0] !== undefined) ? QUESTIONS[0].options[answers[1][0]] : null;
    const colors = answers[2] ? answers[2].map(i => QUESTIONS[1].options[i]).slice(0, 3) : [];
    return `Tu estilo tiene ${firstStyle ? firstStyle : 'varias'} vibras. Te gustan colores como ${colors.length ? colors.join(', ') : 'varios tonos'} — gracias por jugar 💛`;
  }

  // Render
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
          <AnimatePresence>
            {!started && !finished && (
              <motion.div key="start" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <StartScreen onStart={() => { setStarted(true); setIndex(0); }} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {started && !finished && (
              <motion.div key={`q-${questions[index].id}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <QuizScreen
                  question={questions[index]}
                  index={index}
                  total={questions.length}
                  answers={answers}
                  onToggleMulti={toggleMulti}
                  onSetSingle={setSingle}
                  onNext={handleNext}
                  onBack={handleBack}
                  disabled={sending}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {finished && (
              <motion.div key="final" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                <FinalScreen summary={computeSummaryForDisplay()} onShare={() => {}} onRestart={restart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">Diseño suave, juguetón y profesional — listo para impresionar 💫</p>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import FinalScreen from "./FinalScreen";
import emailjs from "@emailjs/browser";


export default function G2KY() {
  const questions = useMemo(() => [
    {
      id: 1,
      text: "¿Cómo describirías tu estilo?",
      type: "single",
      options: ["Casual", "Elegante", "Deportivo", "Otro"],
    },
    {
      id: 2,
      text: "¿Qué colores te gustan?",
      type: "multi",
      options: ["Negro", "Blanco", "Pasteles", "Colores fuertes", "Otro"],
    },
    {
      id: 3,
      text: "Cuéntame algo que te guste mucho últimamente",
      type: "text",
    },
  ], []);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);

  // 🔑 estructura estable
  const [answers, setAnswers] = useState({});

  const current = questions[index];

  function ensureAnswer(qId) {
    return answers[qId] || { selected: [], otherText: "", text: "" };
  }

  function toggleMulti(qId, optIndex) {
    setAnswers(prev => {
      const cur = ensureAnswer(qId);
      const exists = cur.selected.includes(optIndex);
      return {
        ...prev,
        [qId]: {
          ...cur,
          selected: exists
            ? cur.selected.filter(i => i !== optIndex)
            : [...cur.selected, optIndex],
        },
      };
    });
  }

  function setSingle(qId, optIndex) {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...ensureAnswer(qId),
        selected: [optIndex],
      },
    }));
  }

  function setOtherText(qId, text) {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...ensureAnswer(qId),
        otherText: text,
      },
    }));
  }

  function setTextAnswer(qId, text) {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...ensureAnswer(qId),
        text,
      },
    }));
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      const summary = computeSummary();

      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { message: summary },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setFinished(true);
        setStarted(false);
      })
      .catch(err => {
        console.error(err);
        alert("Error enviando el correo");
      });

      return;
    }
    setIndex(i => i + 1);
  }

  function handleBack() {
    if (index === 0) {
      setStarted(false);
      return;
    }
    setIndex(i => i - 1);
  }

  function computeSummary() {
    return questions.map(q => {
      const a = ensureAnswer(q.id);

      if (q.type === "text") {
        return `${q.text}\n→ ${a.text || "—"}`;
      }

      const opts = a.selected.map(i => q.options[i]).join(", ");
      const other = a.otherText ? `, Otro: ${a.otherText}` : "";
      return `${q.text}\n→ ${opts || "—"}${other}`;
    }).join("\n\n");
  }

  function restart() {
  setAnswers({});
  setIndex(0);
  setFinished(false);
  setStarted(false);
}


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <AnimatePresence>
          {!started && !finished && (
            <motion.div>
              <StartScreen onStart={() => { setStarted(true); setIndex(0); }} />
            </motion.div>
          )}

          {started && !finished && (
            <motion.div key={current.id}>
              <QuizScreen
                question={current}
                index={index}
                total={questions.length}
                answer={ensureAnswer(current.id)}
                onToggleMulti={toggleMulti}
                onSetSingle={setSingle}
                onSetOtherText={setOtherText}
                onSetTextAnswer={setTextAnswer}
                onNext={handleNext}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {finished && (
            <FinalScreen summary={computeSummary()} onRestart={restart} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

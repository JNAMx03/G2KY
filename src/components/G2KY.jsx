import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import FinalScreen from "./FinalScreen";

/*
 MoodQuiz: Componente principal que coordina el flujo:
 - start -> quiz (una pregunta por pantalla) -> final
*/

export default function MoodQuiz(){
  const questions = useMemo(()=>[
    { id:1, text:"¿Cómo describirías tu estilo en el día a día?", type:"single", options:["Casual","Cute / tierno","Elegante","Minimalista","Deportivo","Alternativo"] },
    { id:2, text:"¿Qué colores te gustan más para ropa o accesorios?", type:"multi", options:["Negro","Blanco","Pasteles","Colores fuertes","Tonos tierra","Metálicos"] },
    { id:3, text:"¿Qué accesorios usas más?", type:"multi", options:["Collares","Aretes","Manillas","Anillos","No uso muchos accesorios"] },
    { id:4, text:"¿Qué prefieres cuando te dan un detalle?", type:"multi", options:["Algo útil","Algo bonito","Algo sorpresa","Algo hecho a mano","Algo sentimental"] },
    { id:5, text:"¿Qué te gusta hacer cuando tienes tiempo libre?", type:"multi", options:["Ver series/películas","Escuchar música","Salir","Dibujar","Cocinar","Dormir","Jugar","Leer"] },
    { id:6, text:"¿Qué planes disfrutas más?", type:"single", options:["Planes tranquilos en casa","Salir a algún lugar","Planes espontáneos","Comer algo rico afuera"] },
    { id:7, text:"¿Qué tipo de aromas te gustan más?", type:"single", options:["Dulces","Frescos","Florales","Cítricos","Amaderados"] },
    { id:8, text:"¿Qué estilo visual te gusta más?", type:"single", options:["Minimalista","Cute / kawaii","Colorido","Natural","Elegante"] },
    { id:9, text:"¿Qué ambientes te gustan más?", type:"multi", options:["Acogedores","Con luz suave","Coloridos","Naturales","Ordenados","Minimalistas"] },
    { id:10, text:"¿Qué cosas te hacen sentir más cómoda?", type:"multi", options:["Ropa suelta","Ropa ajustada","Colores neutros","Accesorios sencillos","Accesorios llamativos"] },
    { id:11, text:"¿En qué te fijas más cuando te gusta algo nuevo?", type:"single", options:["Cómo se ve","Si es útil","Si combina con lo que ya tengo","Si es de buena calidad"] }
  ],[]);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[index];

  function toggleMulti(qId, optIndex){
    setAnswers(prev=>{
      const cur = prev[qId] ? [...prev[qId]] : [];
      const exists = cur.includes(optIndex);
      const next = exists ? cur.filter(i=>i!==optIndex) : [...cur, optIndex];
      return {...prev, [qId]: next};
    });
  }

  function setSingle(qId,optIndex){
    setAnswers(prev=> ({...prev, [qId]: [optIndex]}));
  }

  function handleNext(){
    const a = answers[current.id] || [];
    if(a.length === 0){
      // Mensaje sutil
      window.alert("Selecciona al menos una opción ✨");
      return;
    }
    if(index + 1 >= questions.length){
      setFinished(true);
      setStarted(false);
      return;
    }
    setIndex(i=>i+1);
  }

  function handleBack(){
    if(index === 0){
      setStarted(false);
      return;
    }
    setIndex(i=>Math.max(0,i-1));
  }

  function restart(){
    setFinished(false);
    setStarted(true);
    setIndex(0);
    setAnswers({});
  }

  function computeSummary(){
    const styleAns = answers[1] ? answers[1].map(i=>questions[0].options[i]) : [];
    const colors = answers[2] ? answers[2].map(i=>questions[1].options[i]) : [];
    const firstStyle = styleAns[0] || colors[0] || "una vibra única";
    return `Tu estilo tiene ${styleAns.length>0 ? styleAns.join(', ') : 'varias' } vibras. Te atraen colores como ${colors.length>0 ? colors.join(', ') : 'varios tonos' } — gracias por jugar 💛`;
  }

  function shareWhatsApp(){
    const text = encodeURIComponent("Jajaja mira mi resultado ✨");
    window.open(`https://wa.me/?text=${text}`,'_blank');
  }

  const handleFinish = () => { 
    // Después de calcular las respuestas finales, agrega lo siguiente:

    const formatted = Object.entries(answers)
      .map(([key, value]) => {
        const pregunta = questions[key].question;
        const opcion = Array.isArray(value)
          ? value.map(v => questions[key].options[v]).join(", ")
          : questions[key].options[value];

        return `${pregunta} → ${opcion}`;
      })
      .join("\n");

    const mensaje = `Emily respondió:\n\n${formatted}`;

    // Tu número aquí:
    const numero = "573001234567"; 

    // Enviar mensaje a WhatsApp automáticamente
    const whatsappURL = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    setTimeout(() => {
      window.open(whatsappURL, "_blank");
    }, 800);

   }


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
          <AnimatePresence>
            {!started && !finished && (
              <motion.div key="start" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.35}}>
                <StartScreen onStart={()=>{ setStarted(true); setIndex(0); }} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {started && !finished && (
              <motion.div key={`q-${current.id}`} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.3}}>
                <QuizScreen
                  question={current}
                  index={index}
                  total={questions.length}
                  answers={answers}
                  onToggleMulti={toggleMulti}
                  onSetSingle={setSingle}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {finished && (
              <motion.div key="final" initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.98}} transition={{duration:0.3}}>
                <FinalScreen summary={computeSummary()} onShare={shareWhatsApp} onRestart={restart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">Diseño suave, juguetón y profesional — listo para impresionar 💫</p>
      </div>
    </div>
  );
}

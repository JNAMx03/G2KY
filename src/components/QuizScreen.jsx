import React from "react";
import Option from "./Option";

export default function QuizScreen({ question, index, total, answers, onToggleMulti, onSetSingle, onNext, onBack, disabled }){
  const selected = answers[question.id] || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-500">Pregunta {index+1} / {total}</div>
        <div className="text-sm text-gray-400">{question.type === 'single' ? 'Elige 1' : 'Puedes elegir varias'}</div>
      </div>

      <h2 className="text-lg font-medium">{question.text}</h2>

      <div className="mt-4 grid gap-3">
        {question.options.map((opt, i)=> (
          <Option
            key={i}
            text={opt}
            selected={selected.includes(i)}
            type={question.type}
            onClick={() => question.type === 'single' ? onSetSingle(question.id,i) : onToggleMulti(question.id,i)}
            disabled={disabled}
          />
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-gray-200">Atrás</button>
        <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold">{ index+1 === total ? 'Finalizar' : 'Siguiente ➜' }</button>
      </div>
    </div>
  );
}

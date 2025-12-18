import React from "react";
import Option from "./Option";

export default function QuizScreen({
  question,
  index,
  total,
  answer,
  onToggleMulti,
  onSetSingle,
  onSetOtherText,
  onSetTextAnswer,
  onNext,
  onBack,
  error,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-500">Pregunta {index + 1} / {total}</div>
        <div className="text-sm text-gray-400">{question.type === 'single' ? 'Elige 1' : 'Puedes elegir varias'}</div>
      </div>

      <h2 className="text-lg font-medium mt-2">{question.text}</h2>

      {/* PREGUNTA TEXTO */}
      {question.type === "text" && (
        <textarea
          className="w-full mt-4 p-3 border rounded-xl"
          value={answer.text}
          onChange={e => onSetTextAnswer(question.id, e.target.value)}
        />
      )}

      {/* OPCIONES */}
      {question.options && (
        <div className="mt-4 grid gap-3">
          {question.options.map((opt, i) => (
            <div key={i}>
              <Option
                text={opt}
                selected={answer.selected.includes(i)}
                type={question.type}
                onClick={() =>
                  question.type === "single"
                    ? onSetSingle(question.id, i)
                    : onToggleMulti(question.id, i)
                }
              />

              {opt.toLowerCase() === "otro" && answer.selected.includes(i) && (
                <input
                  className="mt-2 w-full p-2 border rounded-lg"
                  placeholder="Escribe aquí…"
                  value={answer.otherText}
                  onChange={e => onSetOtherText(question.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={onBack} className="flex-1 py-2 border rounded-xl">
          Atrás
        </button>
        <button onClick={onNext} className="flex-1 py-2 bg-purple-400 text-white rounded-xl">
          {index + 1 === total ? "Finalizar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

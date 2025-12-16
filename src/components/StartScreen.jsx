import React from "react";

export default function StartScreen({ onStart }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center">✨ CONOCIENDOTE ✨</h1>
      {/* <p className="text-sm text-center text-gray-500 mt-2">preguntas rápidas — menos de un minuto.</p> */}
      <div className="mt-6">
        <button onClick={onStart} className="
        w-full
        py-4
        rounded-2xl
        bg-gradient-to-r from-pink-300 to-purple-300
        text-white
        text-lg
        font-semibold
        shadow-lg
        transition-all duration-300 ease-out
        hover:scale-[1.03]
        hover:shadow-xl
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-purple-300/50"
        >
          COMENZAR ➜
        </button>
      </div>
    </div>
  );
}

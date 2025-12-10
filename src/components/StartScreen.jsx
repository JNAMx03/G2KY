import React from "react";

export default function StartScreen({ onStart }){
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center">Tu Mood & Estilo ✨</h1>
      <p className="text-sm text-center text-gray-500 mt-2">11 preguntas rápidas para descubrir tu vibra — menos de un minuto.</p>
      <div className="mt-6">
        <button onClick={onStart} className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-300 to-purple-300 text-white font-semibold shadow-md hover:opacity-95">Comenzar ➜</button>
      </div>
    </div>
  );
}

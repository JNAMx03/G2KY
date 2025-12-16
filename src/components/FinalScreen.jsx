import React from "react";

export default function FinalScreen({ summary, onRestart }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center">✨ GRACIAS POR PARTICIPAR :P ✨</h2>

      {/* <div className="mt-4 text-center text-gray-700 whitespace-pre-wrap leading-relaxed">
        {summary}
      </div> */}

      <button
        onClick={onRestart}
        className="mt-6 w-full py-3 rounded-xl bg-purple-400 text-white font-semibold"
      >
        Volver a jugar
      </button>
    </div>
  );
}


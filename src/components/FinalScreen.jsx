import React from "react";

export default function FinalScreen({ summary, onShare, onRestart }){
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center">Tu resultado ✨</h2>
      <p className="text-center text-gray-600 mt-3">{summary}</p>

      <div className="mt-6 grid gap-3">
        {/* onShare se deja vacío porque se usa EmailJS automático; se deja para futuro */}
        {/* <button onClick={onShare} className="py-3 rounded-xl bg-green-400 text-white font-semibold">Compartir resultado</button> */}
        <button onClick={onRestart} className="py-3 rounded-xl border">Volver a jugar</button>
      </div>
    </div>
  );
}

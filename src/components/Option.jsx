import React from "react";

export default function Option({ text, selected, onClick, type, disabled }){
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all
        ${selected
          ? "bg-purple-50 border-purple-400"
          : "bg-gray-50 border-gray-200 hover:border-gray-300"}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium leading-snug">{text}</span>
        {selected && (
          <span className="text-xs text-purple-500 whitespace-nowrap">
            ✓ Seleccionado
          </span>
        )}
      </div>
    </button>
  );
}

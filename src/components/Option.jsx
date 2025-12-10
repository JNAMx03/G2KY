import React from "react";

export default function Option({ text, selected, onClick, type }){
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-xl border transition-all duration-150 ${selected ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{text}</div>
        <div className="text-xs text-gray-400">{selected ? (type === 'single' ? 'Seleccionado' : '✓') : ''}</div>
      </div>
    </button>
  );
}

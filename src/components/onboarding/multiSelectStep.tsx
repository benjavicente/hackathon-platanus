import React, { useState } from 'react';
import { Step } from './steps';

interface Props {
  stepData: Step;
  onNext: (values: string[]) => void;
}

export function MultiSelectStep({ stepData, onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[var(--brand-color)]">
        {stepData.question}
      </h2>
      {stepData.description && (
        <p className="text-gray-600">{stepData.description}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        {stepData.options?.map((option) => (
          <button
            key={option}
            onClick={() => {
              const newSelected = selected.includes(option)
                ? selected.filter(item => item !== option)
                : [...selected, option];
              setSelected(newSelected);
            }}
            className={`p-4 border-2 rounded-lg transition-colors duration-200
              ${selected.includes(option) 
                ? 'border-[var(--brand-color)] bg-[var(--brand-color)] text-white' 
                : 'hover:border-[var(--brand-color)]'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={() => onNext(selected)}
        disabled={selected.length === 0}
        className={`w-full p-4 rounded-lg text-white transition-colors duration-200
          ${selected.length === 0 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-[var(--brand-color)] hover:opacity-90'
          }`}
      >
        Continue
      </button>
    </div>
  );
}
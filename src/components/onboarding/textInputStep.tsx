import React, { useState, useEffect } from 'react';
import { Step } from './steps';

interface Props {
  stepData: Step;
  onNext: (value: string) => void;
}

export function TextInputStep({ stepData, onNext }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setValue('');
    setError('');
  }, [stepData.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stepData.validation && !stepData.validation(value)) {
      setError('Please enter a valid name (at least 2 characters)');
      return;
    }
    onNext(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-[var(--brand-color)]">
        {stepData.question}
      </h2>
      {stepData.description && (
        <p className="text-gray-600">{stepData.description}</p>
      )}
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          className="w-full p-4 border-2 rounded-lg focus:border-[var(--brand-color)] 
            outline-none transition-colors duration-200"
          placeholder={stepData.placeholder}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={!value}
        className={`w-full p-4 rounded-lg text-white transition-colors duration-200
          ${!value 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-[var(--brand-color)] hover:opacity-90'
          }`}
      >
        Continue
      </button>
    </form>
  );
}
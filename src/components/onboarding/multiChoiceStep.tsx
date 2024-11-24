import { Step } from './steps';

interface Props {
  stepData: Step;
  onNext: (value: string) => void;
}

export function MultiChoiceStep({ stepData, onNext }: Props) {
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
            onClick={() => onNext(option)}
            className="p-4 border-2 rounded-lg hover:border-[var(--brand-color)] 
            transition-colors duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
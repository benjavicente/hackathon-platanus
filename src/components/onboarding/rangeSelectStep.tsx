import { Step } from './steps';

interface Props {
  stepData: Step;
  onNext: (value: string) => void;
}

export function RangeSelectStep({ stepData, onNext }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[var(--brand-color)]">
        {stepData.question}
      </h2>
      {stepData.description && (
        <p className="text-gray-600">{stepData.description}</p>
      )}
      <div className="flex flex-col space-y-3">
        {stepData.options?.map((minutes) => (
          <button
            key={minutes}
            onClick={() => onNext(minutes)}
            className="p-4 border-2 rounded-lg hover:border-[var(--brand-color)] 
              hover:bg-[var(--brand-color)] hover:text-white
              transition-all duration-200 flex justify-between items-center"
          >
            <span>{minutes} minutes</span>
            <span className="text-sm text-gray-500">
              {Number(minutes) <= 15 
                ? 'Quick practice' 
                : Number(minutes) <= 30 
                  ? 'Recommended' 
                  : 'Extended practice'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
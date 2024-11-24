import { onboardingSteps } from './steps';
import { useAtom } from 'jotai';
import { onboardingAtom } from './atoms';

export function StepProgress() {
  const [{ currentStep }] = useAtom(onboardingAtom);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        {onboardingSteps.map((step) => (
          <div
            key={step.id}
            className={`h-2 w-full mx-1 rounded-full ${
              step.id <= currentStep ? 'bg-[var(--brand-color)]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="text-sm text-center mt-2">
        Paso {currentStep} de {onboardingSteps.length}
      </div>
    </div>
  );
}
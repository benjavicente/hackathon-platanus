import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from 'jotai';
import { onboardingAtom } from '../components/onboarding/atoms';
import { StepProgress } from '../components/onboarding/stepProgress';
import { MultiChoiceStep } from '../components/onboarding/multiChoiceStep';
import { onboardingSteps } from '../components/onboarding/steps';
import { MultiSelectStep } from '../components/onboarding/multiSelectStep';
import { TextInputStep } from '../components/onboarding/textInputStep';
import { FinalStep } from '../components/onboarding/finalStep';
import icon from "@/assets/icon.png";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const [onboardingData, setOnboardingData] = useAtom(onboardingAtom);
  const currentStepData = onboardingData.currentStep <= onboardingSteps.length 
    ? onboardingSteps.find((step) => step.id === onboardingData.currentStep)
    : null;

  const handleNext = (value: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      [currentStepData?.name || '']: value
    }));
  };

  const handleBack = () => {
    setOnboardingData((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1)
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <img src={icon} alt="quompy logo" className="h-20 mx-auto" />
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
        <StepProgress />
        <div className="mt-8">
          {currentStepData ? (
            <>
              {currentStepData.type === 'multiChoice' && (
                <MultiChoiceStep 
                  stepData={currentStepData} 
                  onNext={handleNext} 
                />
              )}
              {currentStepData.type === 'multiSelect' && (
                <MultiSelectStep 
                  stepData={currentStepData} 
                  onNext={handleNext} 
                />
              )}
              {currentStepData.type === 'textInput' && (
                <TextInputStep 
                  stepData={currentStepData} 
                  onNext={handleNext} 
                />
              )}
              {onboardingData.currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="mt-4 text-gray-600 hover:text-[var(--brand-color)]"
                >
                  ← Back
                </button>
              )}
            </>
          ) : (
            <FinalStep />
          )}
        </div>
      </div>
    </div>
  );
}
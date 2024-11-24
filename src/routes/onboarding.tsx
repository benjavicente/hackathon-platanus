import { createFileRoute, Link } from "@tanstack/react-router";
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
    <div className="min-h-screen flex flex-col items-center bg-sky-50 p-4">
      <Link to="/"><img src={icon} alt="quompy logo" className="h-20 mx-auto" /></Link>
      <section className="grow flex justify-center items-center">
        <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg">
          { onboardingData.currentStep < onboardingSteps.length && <StepProgress />}
          <div className="">
            {currentStepData ? (
              <>
              {onboardingData.currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="mb-4 text-gray-600 hover:text-[var(--brand-color)] hover:cursor-pointer"
                  >
                    ← Volver
                  </button>
                )}
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
              </>
            ) : (
              <FinalStep />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
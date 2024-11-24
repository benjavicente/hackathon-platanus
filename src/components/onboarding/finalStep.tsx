import { useAtom } from 'jotai';
import { onboardingAtom } from './atoms';
import { useNavigate } from '@tanstack/react-router';

export function FinalStep() {
  const [onboardingData] = useAtom(onboardingAtom);
  const navigate = useNavigate();

  const handleComplete = () => {
    const existingData = JSON.parse(localStorage.getItem('onboardingData') || '[]');
    const newData = [...existingData, {...onboardingData, id: crypto.randomUUID()}];
    localStorage.setItem('onboardingData', JSON.stringify(newData));
    navigate({ to: "/papas" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--brand-color)]">
        Great! We're all set!
      </h2>
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="font-bold capitalize">Here's the Learning Plan Summary for {onboardingData.childName}:</h3>
        <ul className="space-y-2">
          <li>
            <span className="font-semibold">Grade Level:</span> {onboardingData.gradeLevel}
          </li>
          <li>
            <span className="font-semibold">Interests:</span> {onboardingData.interests}
          </li>
          <li>
            <span className="font-semibold">Focus Topics:</span>
            <ul className="list-disc ml-6 mt-1">
              {onboardingData.topics?.map(topic => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      <button
        onClick={handleComplete}
        className="w-full p-4 bg-[var(--brand-color)] text-white rounded-lg
          hover:opacity-90 transition-colors duration-200"
      >
        Start Learning Journey
      </button>
    </div>
  );
}
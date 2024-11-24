import { atom } from 'jotai';

export interface OnboardingData {
  gradeLevel?: string;
  topics?: string[];
  dailyMinutes?: string;
  childName?: string;
  currentStep: number;
}

export const onboardingAtom = atom<OnboardingData>({
  currentStep: 1
});
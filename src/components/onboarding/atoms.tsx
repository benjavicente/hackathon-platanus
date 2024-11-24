import { OnboardingData } from '../types/onboarding';
import { atom } from 'jotai';

export const onboardingAtom = atom<OnboardingData>({
  currentStep: 1,
  topics: []
});
export interface OnboardingData {
    currentStep: number;
    gradeLevel?: string;
    topics: string[];
    interests?: string;
    childName?: string;
  }

export interface OnboardingDataWithId extends OnboardingData {
    id: string;
}
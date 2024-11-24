export type StepType = 'multiChoice' | 'textInput' | 'multiSelect' | 'rangeSelect';

export interface Step {
  id: number;
  type: StepType;
  name: string;
  question: string;
  description?: string;
  options?: string[];
  validation?: (value: any) => boolean;
  required?: boolean;
  placeholder?: string;
}

export const onboardingSteps: Step[] = [
  {
    id: 1,
    name: 'gradeLevel',
    type: 'multiChoice',
    question: "What's your child's grade level?",
    description: "This helps us customize the math lessons appropriately",
    options: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'],
    required: true
  },
  {
    id: 2,
    name: 'topics',
    type: 'multiSelect',
    question: "Which math topics interest your child the most?",
    options: ['Addition/Subtraction', 'Multiplication/Division', 'Fractions', 'Geometry', 'Word Problems'],
    required: true
  },
  {
    id: 3,
    name: 'interests',
    type: 'textInput',
    question: "Does your child have any special interests or hobbies?",
    description: "We'll use this to personalize their experience",
    validation: (value: string) => value.length >= 2,
    required: true,
    placeholder: "e.g. dinosaurs, space, sports"
  },
  {
    id: 4,
    name: 'childName',
    type: 'textInput',
    question: "What's your child's name?",
    description: "We'll use this to personalize their experience",
    validation: (value: string) => value.length >= 2,
    required: true,
    placeholder: "Enter your child's name"
  }
];
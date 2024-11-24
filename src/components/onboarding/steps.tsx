export type StepType = 'multiChoice' | 'textInput' | 'multiSelect' | 'rangeSelect';

export interface Step {
  id: number;
  type: StepType;
  question: string;
  description?: string;
  options?: string[];
  validation?: (value: any) => boolean;
  required?: boolean;
}

export const onboardingSteps: Step[] = [
  {
    id: 1,
    type: 'multiChoice',
    question: "What's your child's grade level?",
    description: "This helps us customize the math lessons appropriately",
    options: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'],
    required: true
  },
  {
    id: 2,
    type: 'multiSelect',
    question: "Which math topics interest your child the most?",
    options: ['Addition/Subtraction', 'Multiplication/Division', 'Fractions', 'Geometry', 'Word Problems'],
    required: true
  },
  {
    id: 3,
    type: 'rangeSelect',
    question: "How many minutes per day would you like your child to practice?",
    description: "We recommend 15-30 minutes for optimal learning",
    options: ['10', '15', '20', '30', '45', '60'],
    required: true
  },
  {
    id: 4,
    type: 'textInput',
    question: "What's your child's name?",
    description: "We'll use this to personalize their experience",
    validation: (value: string) => value.length >= 2,
    required: true
  }
];
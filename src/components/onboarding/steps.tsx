export type StepType = "multiChoice" | "textInput" | "multiSelect" | "rangeSelect";

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
    name: "gradeLevel",
    type: "multiChoice",
    question: "¿En qué curso está tu hijo/a?",
    description: "Esto nos ayuda a personalizar las lecciones de matemáticas",
    options: ["1° Básico", "2° Básico", "3° Básico", "4° Básico", "5° Básico", "6° Básico"],
    required: true,
  },
  {
    id: 2,
    name: "topics",
    type: "multiSelect",
    question: "¿Qué temas de matemáticas es importante que aprenda tu hijo/a?",
    options: ["Suma/Resta", "Multiplicación/División", "Fracciones", "Geometría"],
    required: true,
  },
  {
    id: 3,
    name: "interests",
    type: "textInput",
    question: "¿Tu hijo/a tiene algún interés o pasatiempo especial?",
    description: "Usaremos esto para personalizar su experiencia",
    validation: (value: string) => value.length >= 2,
    required: true,
    placeholder: "ej: dinosaurios, espacio, deportes",
  },
  {
    id: 4,
    name: "childName",
    type: "textInput",
    question: "¿Cómo se llama tu hijo/a?",
    description: "Usaremos esto para personalizar su experiencia",
    validation: (value: string) => value.length >= 2,
    required: true,
    placeholder: "Ingresa el nombre de tu hijo/a",
  },
];

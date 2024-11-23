import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { z } from "zod";

export interface ProblemQuestion {
  type: string;
  question: string;
  options: string[];
  correctOption: number;
}

// export const QuestionSchema = z.object({
//   isapre: z
//     .enum(options, {
//       errorMap: (issue, ctx) => {
//         if (issue.code === "invalid_enum_value") {
//           return { message: "Respuesta incorrecta." };
//         }
//         return { message: issue.message ?? "Error." };
//       },
//     })
//     .nullable()
//     .optional(),
// });
//
const QuestionForm = ({ type, question, options, correctOption }): ProblemQuestion => {
  const [isSuccess, setSuccess] = setState<boolean>(false);
  const answerMutation = useConvexMutation(api.steps.answer);
  const sendAnswer = useMutation({
    mutationFn: answerMutation,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {},
  });

  return (
    <div>
      <h1>{question}</h1>
      <div>
        {options.map((option, index) => (
          <button
            key={index}
            value={index}
            onClick={() => {
              sendAnswer.mutate({ type, question, answer: index });
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

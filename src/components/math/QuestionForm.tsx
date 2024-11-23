import { useMutation } from "convex/react";
import { z } from "zod";
export const QuestionSchema = z.object({
  isapre: z
    .enum(ISAPRES, {
      errorMap: (issue, ctx) => {
        if (issue.code === "invalid_enum_value") {
          return { message: "Respuesta incorrecta." };
        }
        return { message: issue.message ?? "Error." };
      },
    })
    .nullable()
    .optional(),
});

export type Question = z.infer<typeof QuestionSchema>;



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
const QuestionForm = (({type,question, options,correctOption}):ProblemQuestion => {




  const sendData = useMutation({
    mutationFn: async () => {

    }
  })

  return()

})

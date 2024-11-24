import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const lessonStepSchema = z.object({
  pregunta: z.optional(z.number()).default(0),
});

export const Route = createFileRoute("/hijos/$lessonId/$lessonStepId")({
  component: RouteComponent,
  validateSearch: zodValidator(lessonStepSchema),
  parseParams: ({ lessonStepId }) => {
    return { lessonStepId: lessonStepId as Id<"lessonSteps"> };
  },
});

function RouteComponent() {
  // getAnswers
  const { lessonId, lessonStepId } = Route.useParams();
  const { pregunta } = Route.useSearch();
  const { data: state } = useSuspenseQuery(convexQuery(api.steps.get, { stepId: lessonStepId }));
  const { data: lesson } = useSuspenseQuery(convexQuery(api.lessons.get, { id: lessonId as Id<"lessons"> }));

  const nextActivityIndex = lesson.steps.findIndex((step) => step._id === lessonStepId) + 1;
  const nextActivity = lesson.steps.at(nextActivityIndex);

  const navigate = Route.useNavigate();
  const markAsDone = useConvexMutation(api.steps.markAsDone);
  const markAsDoneMutation = useMutation({
    mutationFn: async (event: any) => {
      await markAsDone({ stepId: lessonStepId });
    },
    onSuccess: async () => {
      if (nextActivity) {
        return navigate({ to: Route.fullPath, params: { lessonStepId: nextActivity._id }, search: { pregunta: 0 } });
      } else {
        return navigate({ to: "../end" });
      }
    },
  });

  const answerMutation = useConvexMutation(api.steps.makeAnswer);
  const sendAnswer = useMutation({
    mutationFn: async (valueIndex: number) => {
      return await answerMutation({ stepId: lessonStepId, choice: { index: pregunta, value: valueIndex } });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (isCorrect) => {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
  });

  if (state.type === "explanation") {
    return (
      <>
        <AIChat
          messages={state.messages}
          id={state.id}
          endActivityCallback={markAsDoneMutation.mutate}
          endActivityMessage={nextActivity ? "Siguiente actividad" : "Terminar leccion"}
        />
      </>
    );
  }

  const actualQuestion = state.questionsStates[pregunta];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="grow ">
        <div className="border-green-400 bg-green-50 px-4 py-16 rounded-lg shadow-sm">{actualQuestion.question}</div>
      </div>

      <div className="flex flex-col w-full  gap-2">
        {sendAnswer.isPending ? (
          "Cargando..."
        ) : actualQuestion.isCorrect === null ? (
          actualQuestion.options.map((option, index) => {
            return (
              <div key={index} className="col-span-1">
                <button
                  className="bg-gray-50 hover:outline-gray-200  hover:outline w-full hover:cursor-pointer text-4xl transform transition hover:scale-115 py-2l"
                  onClick={() => sendAnswer.mutate(index)}
                >
                  {option}
                </button>
              </div>
            );
          })
        ) : (
          <div>
            {actualQuestion.isCorrect ? <h1>Correcto</h1> : <h1>Incorrecto</h1>}
            {pregunta === state.questionsStates.length - 1 ? (
              nextActivity ? (
                <button onClick={markAsDoneMutation.mutate}>Siguiente actividad</button>
              ) : (
                <button onClick={markAsDoneMutation.mutate}>Terminar leccion</button>
              )
            ) : (
              <Link from={Route.fullPath} to={Route.fullPath} search={{ pregunta: pregunta + 1 }}>
                Siguiente pregunta
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const msgStyles = cva({
  base: "rounded px-2 py-1",
  variants: {
    role: {
      system: "hidden",
      user: "ml-8 bg-sky-100 border border-sky-200",
      assistant: "mr-8 bg-white border border-sky-200",
      data: "bg-red-500",
    },
  },
});

function AIChat({
  messages: initialMessages,
  id,
  endActivityCallback,
  endActivityMessage,
}: {
  messages: Message[];
  id: string;
  endActivityCallback: () => void;
  endActivityMessage: string;
}) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: import.meta.env.VITE_CONVEX_URL.replace(".cloud", ".site") + "/explain",
    initialMessages: initialMessages,
    id,
  });

  return (
    <>
      <h1>Math</h1>
      {/* <InfiniteNumberLineSchema />
      <MultiplicationBlocks /> */}
      <div className="flex flex-col grow gap-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={msgStyles({ role: message.role })}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe un mensaje"
          className="grow border border-sky-600 px-2 bg-white round-xs"
        />

        <button type="submit" className="bg-sky-500 text-white px-2 rounded-xs">
          Enviar
        </button>
      </form>
      <button onClick={endActivityCallback} className="bg-sky-500 text-white px-2 rounded-xs mt-2">
        {endActivityMessage}
      </button>
    </>
  );
}

import correctSound from "../../assets/correct.mp3";
import wrongSound from "../../assets/wrong.mp3";

import { Message, useChat } from "@ai-sdk/react";
import { cva } from "cva";
async function playCorrectSound() {
  const audio = new Audio(correctSound);
  await audio.play();
}

async function playIncorrectSound() {
  const audio = new Audio(wrongSound);
  await audio.play();
}

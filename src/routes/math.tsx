import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Message, useChat } from "ai/react";
import InfiniteNumberLineSchema from "../components/math/InfiniteNumberLine";
import MultiplicationBlocks from "@/components/math/MultiplierBlocks";

export const Route = createFileRoute("/math")({
  component: RouteComponent,
});

// para ver una implementacion del tipo del input ver esto
// ver https://github.com/vercel/ai-chatbot/blob/ef1403441e13a31b505b10d180d992e93f6d9223/components/message.tsx#L58-L95

export interface ProblemQuestion {
  type: string;
  question: string;
  options: string[];
  correctOption: number;
}
const problem: ProblemQuestion = {
  type: "choice",
  question: "¿Cual es la pregunta correcta?",
  options: ["tu facts", "facts", "sad", "test"],
  correctOption: 1,
};
function RouteComponent() {
  const chatId = "test";
  const mockData: Message[] = [
    {
      id: "asd",
      content:
        "Eres un asistente de matematicas que ayuda a los estudiantes a aprender. Tienes que tener un tono amigable.",
      role: "system",
    },
  ];
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: import.meta.env.VITE_CONVEX_URL.replace(".cloud", ".site") + "/explain",
    body: {
      chatId,
    },
    initialMessages: mockData || [[]],
  });

  return (
    <>
      <h1>Math</h1>
      {/* <InfiniteNumberLineSchema />
      <MultiplicationBlocks /> */}
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={handleInputChange} placeholder="Escribe un mensaje" />

        <div>{problem.question}</div>

        {problem.options.map((option) => {
          return <button key={option}>{option}</button>;
        })}

        <button type="submit">Enviar</button>
      </form>
    </>
  );

}

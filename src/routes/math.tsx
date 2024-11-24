import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Message, useChat } from "ai/react";
import InfiniteNumberLineSchema from "../components/math/InfiniteNumberLine";
import MultiplicationBlocks from "@/components/math/MultiplierBlocks";
import { Latex } from "@/components/math/Formula";
import { Fragment } from "react";

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
  // const mockData: Message[] = [
  //   {
  //     id: "asd",
  //     content:
  //       "Eres un asistente de matematicas que ayuda a los estudiantes a aprender. Tienes que tener un tono amigable.",
  //     role: "system",
  //   },
  // ];
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: import.meta.env.VITE_CONVEX_URL.replace(".cloud", ".site") + "/explain",
    body: {
      chatId,
    },
    initialMessages: [],
    onFinish: () => {
      console.log(messages);
    },
    onToolCall: (tool) => {
      console.log(tool);
    },
  });

  return (
    <Fragment key="form-container-math">
      <h1>Math</h1>
      {/* <InfiniteNumberLineSchema />
      InfiniteNumberLine<MultiplicationBlocks /> */}
      <div>
        {messages.map((message) => (
          <Fragment key={message.id}>
            {message.content ? <div key={message.id}> {message}</div> : null}
            {message.toolInvocations?.map((tool) => {
              if (tool.toolName === "showNextActivityButton") {
                return <button className="bg-sky-500 text-white px-2 rounded-xs w-full">terminar funcion</button>;
              }

              if (tool.toolName === "getInfiniteNumber") {
                return <InfiniteNumberLineSchema key={tool.toolCallId} />;
              }

              if (tool.toolName === "createPlot") {
                return <div>createPlot</div>;
              }
            })}
          </Fragment>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={handleInputChange} placeholder="Escribe un mensaje" />
        <button type="submit">Enviar</button>
      </form>
    </Fragment>
  );
}

const renderToolInvocation = (tool: any, messageId: string) => {
  switch (tool.toolName) {
    case "InfiniteNumberLine":
      return <InfiniteNumberLineSchema key={`${messageId}-${tool.toolCallId}`} />;
    case "MultiplicationBlocks":
      return <MultiplicationBlocks key={`${messageId}-${tool.toolCallId}`} />;
    case "getLatex":
      return <Latex latex={tool.result} key={`${messageId}-${tool.toolCallId}`} />;
    default:
      return null;
  }
};

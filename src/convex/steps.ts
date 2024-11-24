import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const makeAnswer = mutation({
  args: {
    stepId: v.id("lessonSteps"),
    choice: v.object({
      index: v.number(),
      value: v.number(),
    }),
  },
  handler: async (ctx, { stepId, choice }) => {
    const step = await ctx.db.get(stepId);
    if (!step) throw new Error("Step not found");
    if (!step.contextId) throw new Error("No context found");
    const context = await ctx.db.get(step.contextId);
    if (!context) throw new Error("Context not found");
    const state = await ctx.db
      .query("lessonStepsState")
      .withIndex("by_stepid", (q) => q.eq("stepId", stepId))
      .unique();
    if (!state) throw new Error("State does not exist");

    if (state.type === "choice" && context.type === "exercise") {
      if (choice.index !== state.responses.length) {
        throw new Error(`Invalid choice: invalid index: ${choice.index} ${state.responses.length}`);
      }

      const newResponse = [...state.responses, choice.value];
      await ctx.db.patch(state._id, { responses: newResponse });

      return choice.value === context.questions[choice.index].correctOption;
    } else {
      throw new Error("Invalid state");
    }
  },
});

export const get = query({
  args: {
    stepId: v.id("lessonSteps"),
  },
  handler: async (ctx, { stepId }) => {
    const step = await ctx.db.get(stepId);
    if (!step) throw new Error("Step not found");

    const state = await ctx.db
      .query("lessonStepsState")
      .withIndex("by_stepid", (q) => q.eq("stepId", stepId))
      .unique();

    if (!state) throw new Error("State does not exist");
    if (!step.contextId) throw new Error("No context found");
    const context = await ctx.db.get(step.contextId);
    if (!context) throw new Error("Context not found");

    if (context.type === "exercise") {
      return {
        type: "exercise",
        questionsStates: context.questions.map((question, index) => {
          console.log(state.responses.length, index, state.responses[index] === question.correctOption);
          return {
            type: "exercise",
            question: question.question,
            options: question.options,
            isCorrect: index >= state.responses.length ? null : state.responses[index] === question.correctOption,
          };
        }),
      } as const;
    } else if (context.type === "explanation") {
      return {
        type: "explanation",
        messages: [],
      } as const;
    } else {
      throw new Error("Invalid context type");
    }
  },
});

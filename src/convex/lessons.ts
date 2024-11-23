import { v } from "convex/values";
import {
  action,
  internalAction,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";

export const list = query({
  handler: async (ctx) => {
    return ctx.db.query("lessons").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const lessonId = await ctx.db.insert("lessons", { name });
    const createScheduledId = await ctx.scheduler.runAfter(
      internal.lessons.createSteps,
      0,
      {},
    );
    await ctx.db.patch(lessonId, { createScheduledId });

    //
    const step1 = await ctx.db.insert("lessonSteps", {
      type: "explanation",
      lessonId,
    });
    const scheduled1 = await ctx.scheduler.runAfter(
      0,
      internal.lessons.createStep,
      {
        stepId: step1,
      },
    );
    ctx.db.patch(step1, { scheduledCreateId: scheduled1 });

    const step2 = await ctx.db.insert("lessonSteps", {
      type: "explanation",
      lessonId,
      previousStep: step1,
    });
    const scheduled2 = await ctx.scheduler.runAfter(
      0,
      internal.lessons.createStep,
      {
        stepId: step2,
      },
    );
    ctx.db.patch(step2, { scheduledCreateId: scheduled2 });

    const step3 = await ctx.db.insert("lessonSteps", {
      type: "explanation",
      lessonId,
      previousStep: step2,
    });
    const scheduled3 = await ctx.scheduler.runAfter(
      0,
      internal.lessons.createStep,
      {
        stepId: step3,
      },
    );
    ctx.db.patch(step3, { scheduledCreateId: scheduled3 });

    await ctx.db.patch(lessonId, { stepGoalId: step3, currentStepId: step1 });

    return { lessonId };
  },
});

export const createStep = internalAction({
  handler: async (ctx, { stepId }) => {
    const randomInt = Math.floor(Math.random() * 10);
    await new Promise((resolve) => setTimeout(resolve, randomInt * 1000));
  },
});

async function getCompleteStep(ctx: QueryCtx, step: Doc<"lessonSteps">) {
  if (!step.scheduledCreateId) throw new Error("No scheduled function");
  const scheduled = await ctx.db.system.get(step.scheduledCreateId);
  if (!scheduled) throw new Error("Scheduled function not found");
  return { ...step, scheduledCreate: scheduled };
}

export const get = query({
  args: {
    id: v.id("lessons"),
  },
  handler: async (ctx, { id }) => {
    const lesson = await ctx.db.get(id);
    if (!lesson) throw new Error("Lesson not found");
    if (!lesson.stepGoalId) throw new Error("Lesson has no steps");
    let currentLessonState = await ctx.db.get(lesson.stepGoalId);
    if (!currentLessonState) throw new Error("Lesson step not found");

    const steps = [await getCompleteStep(ctx, currentLessonState)];

    while (currentLessonState.previousStep) {
      currentLessonState = await ctx.db.get(currentLessonState.previousStep);
      if (!currentLessonState) break;
      steps.push(await getCompleteStep(ctx, currentLessonState));
    }

    return { ...lesson, steps: steps.reverse() };
  },
});

const _delete = mutation({
  args: {
    id: v.id("lessons"),
  },
  handler: async (ctx, { id }) => {
    return ctx.db.delete(id);
  },
});
export { _delete as delete };

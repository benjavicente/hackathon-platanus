import { Infer, v } from "convex/values";
import { internalAction, internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";
import { generateExercise, generateExplanation, generateLessonPlan } from "./ai";
import { lessonStepContextSchema } from "./schema";
import { last } from "node_modules/@tanstack/react-router/dist/esm/utils";

export const list = query({
  handler: async (ctx) => {
    return ctx.db.query("lessons").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    parentContextDescription: v.string(),
  },
  handler: async (ctx, { name, parentContextDescription }) => {
    const lessonId = await ctx.db.insert("lessons", {
      name: name,
      ready: false,
    });
    const createScheduledId = await ctx.scheduler.runAfter(0, internal.lessons.buildLessonWithAI, {
      lessonId,
      parentContextDescription,
    });
    await ctx.db.patch(lessonId, { createScheduledId });

    return { lessonId };
  },
});

export const buildLessonWithAI = internalAction({
  args: { lessonId: v.id("lessons"), parentContextDescription: v.string() },
  handler: async (ctx, { lessonId, parentContextDescription }) => {
    const plan = await generateLessonPlan({ parentContextDescription });

    // TODO: actualizar la lección con la descripción
    await ctx.runMutation(internal.lessons.createSteps, {
      lessonId,
      lessonGoal: plan.lessonGoalDescription,
      steps: plan.lessonSteps,
    });
  },
});

export const createSteps = internalMutation({
  args: {
    lessonId: v.id("lessons"),
    lessonGoal: v.string(),
    steps: v.array(
      v.object({
        stepPrompt: v.string(),
        stepDescription: v.string(),
        stepType: v.union(v.literal("explanation"), v.literal("exercise")),
      }),
    ),
  },
  handler: async (ctx, { lessonId, steps, lessonGoal }) => {
    await ctx.db.patch(lessonId, { lessonGoalDescription: lessonGoal });

    const stepsIds = [];
    let lastStepId: Id<"lessonSteps"> | undefined = undefined;
    for (const stepParams of steps.reverse()) {
      const stepId = await ctx.db.insert("lessonSteps", {
        type: stepParams.stepType,
        previousStep: lastStepId,
        lessonId,
      });
      const scheduled = await ctx.scheduler.runAfter(0, internal.lessons.buildStepWithAI, { ...stepParams, stepId });
      await ctx.db.patch(stepId, { scheduledCreateId: scheduled });
      stepsIds.push(stepId);
      await ctx.db.insert("lessonStepsState", {
        type: "choice",
        lessonId: lessonId,
        responses: [],
        stepId: stepId,
      });
      lastStepId = stepId;
    }

    await ctx.db.patch(lessonId, {
      stepGoalId: stepsIds[stepsIds.length - 1],
      currentStepId: stepsIds[0],
    });
  },
});

export const buildStepWithAI = internalAction({
  args: {
    stepPrompt: v.string(),
    stepDescription: v.string(),
    stepType: v.union(v.literal("explanation"), v.literal("exercise")),
    stepId: v.id("lessonSteps"),
  },
  handler: async (ctx, { stepId, stepPrompt, stepDescription, stepType }) => {
    let result: Infer<typeof lessonStepContextSchema>;
    if (stepType === "exercise") {
      const data = await generateExercise({ stepPrompt, stepDescription });
      result = { ...data, type: "exercise" };
    } else if (stepType === "explanation") {
      const data = await generateExplanation({ stepPrompt, stepDescription });
      result = { ...data, type: "explanation" };
    } else {
      throw new Error("Invalid step type");
    }

    await ctx.scheduler.runAfter(0, internal.lessons.saveStep, { stepId, result });
  },
});

export const saveStep = internalMutation({
  args: {
    stepId: v.id("lessonSteps"),
    result: lessonStepContextSchema,
  },
  handler: async (ctx, { stepId, result }) => {
    const contextId = await ctx.db.insert("lessonStepContext", result);
    await ctx.db.patch(stepId, { contextId });
  },
});

async function getCompleteStep(ctx: QueryCtx, step: Doc<"lessonSteps">) {
  if (!step.scheduledCreateId) throw new Error("No scheduled function");
  const scheduled = await ctx.db.system.get(step.scheduledCreateId);
  if (!scheduled) throw new Error("Scheduled function not found");

  if (step.contextId) {
    const context = await ctx.db.get(step.contextId);
    if (context) {
      return { ...step, scheduledCreate: scheduled, context };
    }
  }
  return { ...step, scheduledCreate: scheduled, context: undefined };
}

async function getCompleteLesson(ctx: QueryCtx, lesson: Doc<"lessons">) {
  if (!lesson.createScheduledId) throw new Error("No scheduled function");
  const scheduled = await ctx.db.system.get(lesson.createScheduledId);
  if (!scheduled) throw new Error("Scheduled function not found");
  return { ...lesson, createScheduled: scheduled };
}

export const get = query({
  args: {
    id: v.id("lessons"),
  },
  handler: async (ctx, { id }) => {
    const lesson = await ctx.db.get(id);
    if (!lesson) throw new Error("Lesson not found");

    const completeLesson = await getCompleteLesson(ctx, lesson);
    if (!lesson.stepGoalId) return { ...completeLesson, steps: [] };

    let currentLessonState = await ctx.db.get(lesson.stepGoalId);
    if (!currentLessonState) throw new Error("Lesson step not found");

    const steps = [await getCompleteStep(ctx, currentLessonState)];

    while (currentLessonState.previousStep) {
      currentLessonState = await ctx.db.get(currentLessonState.previousStep);
      if (!currentLessonState) break;
      steps.push(await getCompleteStep(ctx, currentLessonState));
    }

    return { ...completeLesson, steps: steps.reverse() };
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const commonLessonStepSchema = {
  lessonId: v.id("lessons"),
  contextId: v.optional(v.id("lessonStepContext")),
  previousStep: v.optional(v.id("lessonSteps")),
  scheduledCreateId: v.optional(v.id("_scheduled_functions")),
  completed: v.boolean(),
};
const lessonStepSchema = v.union(
  v.object({
    ...commonLessonStepSchema,
    type: v.literal("explanation"),
  }),
  v.object({
    ...commonLessonStepSchema,
    type: v.literal("exercise"),
  }),
);

export const lessonStepContextSchema = v.union(
  v.object({
    type: v.literal("exercise"),
    questions: v.array(
      v.union(
        v.object({
          type: v.literal("choice"),
          question: v.string(),
          options: v.array(v.string()),
          correctOption: v.number(),
        }),
      ),
    ),
  }),
  v.object({
    type: v.literal("explanation"),
    prompt: v.string(),
    initialMessage: v.string(),
  }),
);

const schema = defineSchema({
  lessons: defineTable({
    name: v.string(),
    lessonGoalDescription: v.optional(v.string()),
    createScheduledId: v.optional(v.id("_scheduled_functions")),
    ready: v.boolean(),
    completed: v.boolean(),
    stepGoalId: v.optional(v.id("lessonSteps")),
    currentStepId: v.optional(v.id("lessonSteps")),
  }),
  lessonSteps: defineTable(lessonStepSchema),
  lessonStepContext: defineTable(lessonStepContextSchema),
  lessonStepsState: defineTable(
    v.union(
      v.object({
        type: v.literal("choice"),
        lessonId: v.id("lessons"),
        stepId: v.id("lessonSteps"),
        responses: v.array(v.number()),
      }),
    ),
  ).index("by_stepid", ["stepId"]),
});

export default schema;

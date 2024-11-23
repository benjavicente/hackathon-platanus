import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const commonLessonStepSchema = {
  lessonId: v.id("lessons"),
  previousStep: v.optional(v.id("lessonSteps")),
  scheduledCreateId: v.optional(v.id("_scheduled_functions")),
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

const schema = defineSchema({
  lessons: defineTable({
    lessonGoalDescription: v.string(),
    stepGoalId: v.optional(v.id("lessonSteps")),
    currentStepId: v.optional(v.id("lessonSteps")),
  }),
  lessonSteps: defineTable(lessonStepSchema),
  lessonStepsBuilder: defineTable({
    // ...
  }),
  lessonStepsState: defineTable({
    // ...
  }),
});

export default schema;

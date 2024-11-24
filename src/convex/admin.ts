import { mutation } from "./_generated/server";

export const deleteAll = mutation({
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lessons").collect();
    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }
    const lessonSteps = await ctx.db.query("lessonSteps").collect();
    for (const lessonStep of lessonSteps) {
      await ctx.db.delete(lessonStep._id);
    }
    const lessonStepsBuilder = await ctx.db.query("lessonStepContext").collect();
    for (const lessonStepBuilder of lessonStepsBuilder) {
      await ctx.db.delete(lessonStepBuilder._id);
    }
    const lessonStepsState = await ctx.db.query("lessonStepsState").collect();
    for (const lessonStepState of lessonStepsState) {
      await ctx.db.delete(lessonStepState._id);
    }
  },
});

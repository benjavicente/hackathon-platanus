import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  lessons: defineTable({
    name: v.string(),
    author: v.optional(v.string()),
  }),
});

export default schema;

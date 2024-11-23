import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    return ctx.db.insert("lessons", { name });
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

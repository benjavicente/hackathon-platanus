import { query } from "./_generated/server";

export const obtener = query({
  handler: async (ctx) => {
    return "hola desde el backend";
  },
});

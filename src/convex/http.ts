import { httpRouter } from "convex/server";
import { getMath, createExplanation } from "./math";
const http = httpRouter();

http.route({
  path: "/math",
  method: "GET",
  handler: getMath,
});

http.route({
  path: "/explain",
  method: "POST",
  handler: createExplanation,
});

export default http;

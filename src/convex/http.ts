import { httpRouter } from "convex/server";
import { getMath } from "./math";
const http = httpRouter();

http.route({
  path: "/math",
  method: "GET",
  handler: getMath,
});

export default http;

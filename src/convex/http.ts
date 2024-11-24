import { httpRouter } from "convex/server";
import { getMath, createExplanation } from "./math";
import { httpAction } from "./_generated/server";
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

// Pre-flight request for /sendImage
http.route({
  pathPrefix: "/",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});
export default http;

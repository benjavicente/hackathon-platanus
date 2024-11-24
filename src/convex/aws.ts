"use node";

import AWS from "aws-sdk";

/**
 * Function to query Bedrock Knowledge Base.
 * Replace placeholders with your Bedrock configurations.
 */
export const queryKnowledgeBase = async (prompt: string) => {
  // AWS SDK configuration
  AWS.config.update({
    region: "us-east-1",
    credentials: new AWS.Credentials(process.env.AWS_ACESS_KEY, process.env.AWS_SECRET_KEY),
  });

  const client = new AWS.HttpClient();
  const bedrockEndpoint = "https://bedrock.us-east-1.amazonaws.com"; // Replace with your Bedrock endpoint
  const knowledgeBaseId = "KOYVFRJ2WW"; // Replace with your Knowledge Base ID
  const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0"; // Replace with your Bedrock Model ID

  const payload = JSON.stringify({
    prompt,
    knowledgeBaseId,
    maxTokens: 100,
    temperature: 0.7,
  });

  const options = {
    method: "POST",
    hostname: bedrockEndpoint.replace("https://", ""),
    path: `/v1/models/${modelId}/invoke`, // Replace with the correct Bedrock API path
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length.toString(),
    },
  };

  return new Promise((resolve, reject) => {
    client
      .handleRequest(
        options,
        null,
        (response) => {
          let responseBody = "";
          response.on("data", (chunk) => {
            responseBody += chunk;
          });
          response.on("end", () => {
            try {
              resolve(JSON.parse(responseBody));
            } catch (error) {
              reject(`Failed to parse response: ${error}`);
            }
          });
        },
        (error) => {
          reject(`Request error: ${error}`);
        },
      )
      .write(payload);
  });
};

// Example usage in Convex
export default async function queryHandler(prompt: string): Promise<any> {
  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  try {
    const response = await queryKnowledgeBase(prompt);
    return response;
  } catch (error) {
    console.error("Error querying Bedrock Knowledge Base:", error);
    throw new Error("Failed to query the Knowledge Base.");
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { BRAND_SYSTEM_PROMPT } from "./brand-prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CaptionResult {
  image_description: string;
  caption_en: string;
  caption_th: string;
}

export async function generateCaption(
  imageUrl: string,
): Promise<CaptionResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: BRAND_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "url", url: imageUrl },
          },
          {
            type: "text",
            text: "Generate Instagram captions for this image. Respond with JSON only.",
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse caption response as JSON");
  }

  return JSON.parse(jsonMatch[0]) as CaptionResult;
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { messages, documentContent, isTemplate } = await request.json();

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: isTemplate
        ? []
        : messages.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const latestMessage = messages[messages.length - 1].content;
    let prompt = isTemplate
      ? `You are a professional markdown template creator. Please follow these instructions:

User's request: "${latestMessage}"

Instructions:
- IMPORTANT: Detect the language of the user's request and respond in the same language.
- Create a detailed markdown template for the requested topic
- Use markdown syntax appropriately for headings, sections, and sub-sections
- Add appropriate examples or guidelines for places where actual content will go
- Create a practical and specific template (You can use emojis)
- All text, including examples and guidelines, MUST be in the same language as the user's request.

Create the template now.`
      : `You are a helpful AI assistant. Please follow these instructions:

1. Document content: "${documentContent}"
2. User's question: "${latestMessage}"

Instructions:
- Respond in the same language as the user's question.
- If the user's question is related to the document content, base your answer on that.
- If the question is not related to the document content, use your general knowledge to answer kindly.
- If you don't have information or can't answer the question, honestly say you don't know and suggest alternatives.
- Maintain a friendly and helpful attitude.
- Use emojis appropriately to make your response more friendly.

Now, please answer the user's question.`;

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Sorry, an error occurred. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { messages, documentContent } = await request.json();

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const latestMessage = messages[messages.length - 1].content;
    let prompt = `당신은 친절하고 지식이 풍부한 AI 어시스턴트입니다. 다음 지시사항을 따라주세요:

1. 주어진 문서 내용: "${documentContent}"
2. 사용자의 질문: "${latestMessage}"

지시사항:
- 사용자의 질문이 문서 내용과 관련이 있다면, 문서 내용을 바탕으로 답변하세요.
- 사용자의 질문이 문서 내용과 관련이 없는 일반적인 질문이라면, 당신의 일반 지식을 활용하여 친절하게 답변하세요.
- 문서 내용에 없는 정보라도, 당신이 알고 있는 정보라면 자유롭게 답변해 주세요.
- 질문에 대한 정보가 없거나 답변할 수 없는 경우, 정직하게 모른다고 말하고 대안을 제시하세요.
- 사용자가 질문에 사용한 언어로 답변하고, 친근하고 도움이 되는 태도를 유지하세요.
- 이모티콘을 적절히 사용하여 답변을 더 친근하게 만드세요.

이제 사용자의 질문에 답변해 주세요.`;

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();


    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

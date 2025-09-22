import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const runtime = "nodejs";

async function getKnowledgeBase() {
  const filePath = path.join(process.cwd(), "public", "info", "knowledge-base.txt");

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return fileContents;
  } catch (error) {
    console.error("Error reading knowledge base file:", error);
    return "No knowledge base found.";
  }
}

export async function POST(req: Request) {
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GOOGLE_API_KEY" }), {
      status: 500,
    });
  }

  const { messages } = await req.json();

  const userMessage = messages?.[messages.length - 1]?.content;
  if (!userMessage) {
    return new Response(JSON.stringify({ error: "No user message found" }), {
      status: 400,
    });
  }

  try {
    const knowledgeBase = await getKnowledgeBase();

    const systemPrompt = `You are Junhao Qu. Respond to users strictly using the knowledge base below.\nIf the answer is not present, reply with: "I'm sorry, but I don't have enough information to answer that right now."\nDo not invent information.\n\n---\nKnowledge Base:\n${knowledgeBase}\n---\n`;

    const conversationHistory = (messages ?? [])
      .map((entry: { role: string; content: string }) =>
        `${entry.role === "assistant" ? "Assistant" : "User"}: ${entry.content}`
      )
      .join("\n");

    const promptWithHistory = `${systemPrompt}\nConversation so far:\n${conversationHistory}\nAssistant:`;

    const result = await genAI
      .getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" })
      .generateContentStream(promptWithHistory);

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    return new Response(JSON.stringify({ error: "Failed to generate content" }), {
      status: 500,
    });
  }
}

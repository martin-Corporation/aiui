import { convertToModelMessages, type UIMessage, streamText } from "ai";
import { NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { APP_NAME } from "@/lib/brand";

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: {
    messages: UIMessage[];
    model: Parameters<typeof registry.languageModel>[0];
  } = await req.json();

  try {
    const result = streamText({
      model: registry.languageModel(model),
      system: `You are ${APP_NAME}, a helpful personal assistant.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new NextResponse((error as Error).message, {
      status: 400,
    });
  }
}

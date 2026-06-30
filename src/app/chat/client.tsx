"use client";

import { Prompt } from "@/components/prompt";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { PulseDotLoader } from "@/components/pulse-dot-loader";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeMathML from "@daiji256/rehype-mathml";
import "temml/dist/Temml-Local.css";
import { useEffect } from "react";

export function ChatPageClient({
  initialPrompt,
  initialModel,
}: {
  initialPrompt?: string;
  initialModel?: string;
}) {
  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    if (initialPrompt && initialModel) {
      sendMessage(
        {
          parts: [{ type: "text", text: initialPrompt }],
        },
        {
          body: {
            model: initialModel,
          },
        },
      );
    }
  }, [initialPrompt, initialModel, sendMessage]);

  return (
    <main className="flex flex-col h-screen flex-1">
      <section className="flex-1 overflow-y-auto flex flex-col page-offset gap-4 pb-8">
        {messages.map((message) => (
          <div className="w-full flex flex-col" key={message.id}>
            {message.parts.map((part, e) =>
              message.role === "user" ? (
                part.type === "text" && (
                  <div
                    key={`${message.id}-text-${e}`}
                    className="px-4 py-2.5 self-end bg-muted-background border border-border text-muted-foreground rounded-2xl max-w-fit whitespace-pre-line"
                  >
                    {part.text}
                  </div>
                )
              ) : (
                <div
                  key={`${message.id}-text-${e}`}
                  className="self-start max-w-full"
                >
                  <div className="typography whitespace-pre-wrap *:first:mt-0! *:last:mb-0!">
                    {part.type === "text" && (
                      <Markdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeMathML]}
                      >
                        {part.text}
                      </Markdown>
                    )}
                  </div>
                  {/* TODO: add response actions */}
                </div>
              ),
            )}
          </div>
        ))}
        {status === "submitted" && <PulseDotLoader />}
        {status === "streaming" && <PulseDotLoader animate={false} />}
        {error && (
          <Alert variant="destructive">
            <XMarkIcon />
            <AlertTitle>{error.name}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
            <AlertAction>
              <Button onClick={() => regenerate()}>Retry</Button>
            </AlertAction>
          </Alert>
        )}
      </section>
      <footer className="page-offset sticky bottom-0 pb-4 bg-linear-to-b from-transparent to-background">
        <Prompt
          disabled={status === "submitted" || status === "streaming"}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            e.currentTarget.reset();
            sendMessage(
              {
                parts: [
                  { type: "text", text: formData.get("prompt") as string },
                ],
              },
              {
                body: {
                  model: formData.get("model"),
                },
              },
            );
          }}
        />
      </footer>
    </main>
  );
}

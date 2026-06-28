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
import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/chat-store";
import type { UIMessage } from "ai";

function getChatTitle(messages: UIMessage[]): string | null {
  const firstUser = messages.find((m) => m.role === "user");
  if (firstUser) {
    const text = firstUser.parts.find((p): p is { type: "text"; text: string } => p.type === "text")?.text;
    return text ? text.slice(0, 60) : null;
  }
  return null;
}

export function ChatPageClient({
  initialPrompt,
  initialModel,
}: {
  initialPrompt?: string;
  initialModel?: string;
}) {
  const { chats, currentChatId, createChat, setCurrentChat, updateChatMessages, renameChat } = useChatStore();
  const currentChat = chats.find((c) => c.id === currentChatId);
  const initDone = useRef(false);

  const { messages, setMessages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    if (!currentChat) {
      const id = createChat();
      setCurrentChat(id);
      return;
    }

    if (currentChat.messages.length > 0) {
      setMessages(currentChat.messages);
    }
  }, []);

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

  useEffect(() => {
    if (!currentChatId || messages.length === 0) return;
    updateChatMessages(currentChatId, messages);
  }, [messages, currentChatId, updateChatMessages]);

  useEffect(() => {
    if (!currentChatId || messages.length === 0) return;
    const current = chats.find((c) => c.id === currentChatId);
    if (!current || current.title !== "New Chat") return;
    const title = getChatTitle(messages);
    if (title) {
      renameChat(currentChatId, title);
    }
  }, [messages, currentChatId, chats, renameChat]);

  return (
    <main className="flex flex-col h-screen flex-1">
      <section className="flex-1 overflow-y-auto flex flex-col page-offset gap-4 pb-8">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Start a conversation
          </div>
        )}
        {messages.map((message) => (
          <div className="w-full flex flex-col" key={message.id}>
            {message.parts.map((part, e) =>
              message.role === "user" ? (
                part.type === "text" && (
                  <div
                    key={`${message.id}-text-${e}`}
                    className="px-4 py-2 self-end bg-muted-background text-muted-foreground rounded-3xl max-w-fit whitespace-pre-line"
                  >
                    {part.text}
                  </div>
                )
              ) : (
                <div
                  key={`${message.id}-text-${e}`}
                  className="self-start max-w-full"
                >
                  <div className="typography whitespace-pre-wrap *:first:mt-0! *:last:mb-0! prose-pre:rounded-3xl!">
                    {part.type === "text" && (
                      <Markdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeMathML]}
                      >
                        {part.text}
                      </Markdown>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
        {status === "submitted" && <PulseDotLoader />}
        {status === "streaming" && (
          <div className="rounded-full bg-primary-background size-4">
            <span className="sr-only">Generating response...</span>
          </div>
        )}
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

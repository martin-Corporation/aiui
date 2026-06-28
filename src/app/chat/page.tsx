import { ChatPageClient } from "./client";
import { Suspense } from "react";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <Suspense>
      <ChatPageClient
        initialPrompt={params.prompt as string | undefined}
        initialModel={params.model as string | undefined}
      />
    </Suspense>
  );
}

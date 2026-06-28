import { Prompt } from "@/components/prompt";
import { APP_NAME } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="page-offset py-4 flex flex-col flex-1 typography">
      <Prompt method="get" action="chat" />
      <p className="text-muted-foreground">
        <small>
          {APP_NAME} can make mistakes. Please double-check responses.
        </small>
      </p>
    </main>
  );
}

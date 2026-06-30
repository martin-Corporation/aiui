import { NavigationLink } from "./navigation-link";
import { APP_NAME } from "@/lib/brand";

export function Header() {
  return (
    <header className="sticky top-0 bg-linear-to-b from-background to-transparent h-14 w-full flex items-center py-4 page-offset gap-2.5 z-10">
      <a href="#main-content" className="sr-only focus-visible:not-sr-only">
        Skip to content
      </a>
      <div className="flex items-center justify-center gap-2.5">
        <NavigationLink underline={false} href="/" className="rounded-[20px]">
          {APP_NAME}
        </NavigationLink>
      </div>
    </header>
  );
}

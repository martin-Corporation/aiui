import { NavigationLink } from "./navigation-link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsDialog } from "@/components/settings-dialog";
import { APP_NAME } from "@/lib/brand";

export function Header() {
  return (
    <header className="sticky top-0 bg-linear-to-b from-background to-transparent h-14 w-full flex items-center py-2 page-offset gap-2 z-10">
      <a href="#main-content" className="sr-only focus-visible:not-sr-only">
        Skip to content
      </a>
      <div className="flex items-center justify-center gap-1">
        <SidebarTrigger />
        <NavigationLink underline={false} href="/">
          {APP_NAME}
        </NavigationLink>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <SettingsDialog />
      </div>
    </header>
  );
}

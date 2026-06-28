import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import { buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";

export type NavigationLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode | undefined;
    size?: VariantProps<typeof buttonVariants>["size"];
    underline?: boolean;
  } & React.RefAttributes<HTMLAnchorElement>;

export function NavigationLink({
  className,
  size,
  underline = true,
  ...props
}: NavigationLinkProps) {
  return (
    <Link
      draggable={false}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        underline &&
          "underline underline-offset-4 hover:no-underline active:no-underline",
        className,
      )}
      {...props}
    />
  );
}

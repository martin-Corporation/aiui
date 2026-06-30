"use client";

import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  useMemo,
  useState,
} from "react";
import { ArrowUpIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { models } from "@/lib/models";
import { useMobile } from "@/lib/use-mobile";
import { cn } from "@/lib/utils";

export function Prompt({
  className,
  disabled,
  ...props
}: Omit<ComponentPropsWithoutRef<"form">, "onReset"> & { disabled?: boolean }) {
  const [value, setValue] = useState("");
  const isMobile = useMobile();

  function textareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (isMobile) return;
    if (e.key !== "Enter") return;
    if (e.shiftKey) return;

    e.preventDefault();
    if (value.trim().length === 0 || disabled) return;
    e.currentTarget.form?.requestSubmit();
  }

  const items = useMemo(() => models.flatMap((e) => e.models), []);
  const defaultModel = items[0]?.value ?? "";

  return (
    <form
      onReset={() => setValue("")}
      className={cn(
        "flex min-h-fit flex-col rounded-2xl border border-border focus-within:border-border-focused bg-muted-background",
        className,
      )}
      {...props}
    >
      <textarea
        autoFocus
        required
        value={value}
        className="h-11 resize-none px-4 pt-4 placeholder:select-none focus:outline-0 placeholder:text-muted-foreground text-base md:text-sm"
        placeholder="Ask anything"
        aria-label="Ask anything"
        name="prompt"
        id="main-content"
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={textareaKeyDown}
      ></textarea>
      <div className="flex min-h-fit items-center p-2.5">
        <div className="flex w-full items-center gap-2.5">
          {/* TODO: add attachments */}
        </div>
        <div className="flex min-w-fit items-center gap-2.5">
          <Select
            defaultValue={defaultModel}
            required
            items={items}
            name="model"
          >
            <SelectTrigger className="w-36 h-8.5!">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((group) => (
                <SelectGroup key={group.provider}>
                  <SelectLabel>{group.provider}</SelectLabel>
                  {group.models.map((item) => (
                    <SelectItem
                      className="min-h-8.5"
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={value.trim().length === 0 || disabled}
            size="icon-lg"
            aria-label="Send message"
            type="submit"
          >
            <ArrowUpIcon aria-hidden={true} />
          </Button>
        </div>
      </div>
    </form>
  );
}

import { cn } from "@/lib/utils";

export interface PulseDotLoaderProps {
  animate?: boolean;
}

export function PulseDotLoader({ animate = true }: PulseDotLoaderProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-primary-background size-4",
        animate && "animate-[pulse-dot_1s_ease-in-out_infinite]",
      )}
    >
      <span className="sr-only">Generating response...</span>
    </div>
  );
}

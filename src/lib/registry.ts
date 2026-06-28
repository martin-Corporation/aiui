import { createProviderRegistry } from "ai";
import { ollama } from "ai-sdk-ollama";

export const registry = createProviderRegistry({ ollama });

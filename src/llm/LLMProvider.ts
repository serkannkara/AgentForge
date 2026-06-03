import { LLMProvider, LLMMessage, LLMResponse, LLMOptions } from '../types';

/**
 * Abstract base class for LLM providers
 */
export abstract class BaseLLMProvider implements LLMProvider {
  protected defaultOptions: LLMOptions = {
    temperature: 0.7,
    maxTokens: 2000,
  };

  abstract generate(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>;

  protected mergeOptions(options?: LLMOptions): LLMOptions {
    return {
      ...this.defaultOptions,
      ...options,
    };
  }

  protected formatMessages(messages: LLMMessage[]): string {
    return messages
      .map(msg => `[${msg.role.toUpperCase()}]: ${msg.content}`)
      .join('\n\n');
  }
}
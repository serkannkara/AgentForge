import { BaseLLMProvider } from './LLMProvider';
import { LLMMessage, LLMResponse, LLMOptions } from '../types';

/**
 * OpenAI Provider - Placeholder (Not yet implemented)
 * 
 * To implement:
 * 1. npm install openai
 * 2. Uncomment the implementation below
 * 3. Remove the throw statement
 */
export class OpenAIProvider extends BaseLLMProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_openai_api_key_here') {
      throw new Error(
        'OpenAIProvider requires a valid API key.\n' +
        'Set OPENAI_API_KEY in your .env file or pass it directly.'
      );
    }

    this.apiKey = apiKey;
  }

  async generate(_messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    void this.mergeOptions(options);
    void this.apiKey; // Suppress unused warning

    throw new Error(
      'OpenAIProvider is not yet implemented.\n\n' +
      'To use OpenAI:\n' +
      '1. npm install openai\n' +
      '2. Uncomment the implementation in OpenAIProvider.ts\n' +
      '3. Set OPENAI_API_KEY in your .env file\n\n' +
      'For now, use MockLLMProvider (no API key required).'
    );

    /* IMPLEMENTATION (uncomment after npm install openai):
    
    import OpenAI from 'openai';
    
    const client = new OpenAI({ apiKey: this.apiKey });
    
    const response = await client.chat.completions.create({
      model: options?.model || 'gpt-4-turbo-preview',
      messages: _messages as OpenAI.Chat.ChatCompletionMessageParam[],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
    });

    const choice = response.choices[0];
    
    if (!choice.message?.content) {
      throw new Error('OpenAI returned empty response');
    }

    return {
      content: choice.message.content,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      model: response.model,
    };
    */
  }
}
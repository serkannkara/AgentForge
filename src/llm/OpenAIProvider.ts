import { BaseLLMProvider } from './LLMProvider';
import { LLMMessage, LLMResponse, LLMOptions } from '../types';

/**
 * OpenAI Provider (structure only - requires API key)
 * In production, install: npm install openai
 */
export class OpenAIProvider extends BaseLLMProvider {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      throw new Error('OpenAIProvider requires a valid API key. Set OPENAI_API_KEY in .env file.');
    }
  }

  async generate(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const opts = this.mergeOptions(options);

    // NOTE: This is a placeholder structure
    // To use OpenAI, install: npm install openai
    // Then import: import OpenAI from 'openai';
    
    throw new Error(
      'OpenAIProvider is not fully implemented. ' +
      'To use it:\n' +
      '1. npm install openai\n' +
      '2. Set OPENAI_API_KEY in .env\n' +
      '3. Uncomment implementation in OpenAIProvider.ts\n\n' +
      'For demo purposes, use MockLLMProvider (set LLM_PROVIDER=mock in .env)'
    );

    /*
    // UNCOMMENT THIS AFTER INSTALLING OPENAI PACKAGE:
    
    const openai = new OpenAI({ apiKey: this.apiKey });
    
    const response = await openai.chat.completions.create({
      model: opts.model || 'gpt-4-turbo-preview',
      messages: messages,
      temperature: opts.temperature,
      max_tokens: opts.maxTokens,
    });

    const choice = response.choices[0];
    
    return {
      content: choice.message?.content || '',
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
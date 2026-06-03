import { Agent, AgentInput, AgentOutput, LLMProvider } from '../types';

/**
 * Base Agent class
 * All specialized agents inherit from this
 */
export abstract class BaseAgent implements Agent {
  abstract name: string;
  abstract role: string;
  
  protected llm: LLMProvider;

  constructor(llmProvider: LLMProvider) {
    this.llm = llmProvider;
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>;

  protected validateInput(input: AgentInput): void {
    if (!input) {
      throw new Error(`${this.name}: Input is required`);
    }

    if (!input.goal || typeof input.goal !== 'string') {
      throw new Error(`${this.name}: Valid goal string is required`);
    }

    if (input.goal.trim().length === 0) {
      throw new Error(`${this.name}: Goal cannot be empty`);
    }

    if (input.goal.length > 1000) {
      throw new Error(`${this.name}: Goal too long (max 1000 characters)`);
    }

    if (!input.context || typeof input.context !== 'object') {
      throw new Error(`${this.name}: Valid context object is required`);
    }
  }

  protected createOutput(
    result: any,
    reasoning?: string,
    confidence?: number,
    metadata?: Record<string, any>
  ): AgentOutput {
    return {
      agentName: this.name,
      result,
      reasoning,
      confidence,
      metadata,
      timestamp: new Date(),
    };
  }

  protected log(message: string, data?: any): void {
    console.log(`[${this.name}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
}
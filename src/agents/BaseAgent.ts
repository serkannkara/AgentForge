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
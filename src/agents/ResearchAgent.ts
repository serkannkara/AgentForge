import { BaseAgent } from './BaseAgent';
import { AgentInput, AgentOutput, LLMMessage, Tool } from '../types';

/**
 * Research Agent
 * Gathers information using available tools
 */
export class ResearchAgent extends BaseAgent {
  name = 'ResearchAgent';
  role = 'Information Gathering and Research';

  private tools: Tool[];

  constructor(llmProvider: any, tools: Tool[]) {
    super(llmProvider);
    this.tools = tools;
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    this.log('🔍 Starting research phase...');
    this.log(`Research goal: ${input.goal}`);

    const availableTools = this.tools.map(t => ({
      name: t.name,
      description: t.description
    }));

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are a research agent. Your job is to gather comprehensive information using available tools.

Available tools: ${JSON.stringify(availableTools)}

Output format (JSON):
{
  "findings": [
    {
      "topic": "research topic",
      "insights": ["insight 1", "insight 2"],
      "sources": ["source 1", "source 2"],
      "confidence": 0.0-1.0
    }
  ],
  "methodology": "how research was conducted",
  "toolsUsed": ["tool1", "tool2"]
}

Guidelines:
- Be thorough and objective
- Cross-reference multiple sources
- Identify patterns and trends
- Note confidence levels
- Highlight contradictions or uncertainties`
      },
      {
        role: 'user',
        content: `Research this topic:\n\n${input.goal}\n\nContext: ${JSON.stringify(input.context)}\n\nUse available tools to gather comprehensive information.`
      }
    ];

    const response = await this.llm.generate(messages, {
      temperature: 0.6,
      maxTokens: 2000,
    });

    let findings;
    try {
      findings = JSON.parse(response.content);
    } catch (error) {
      this.log('⚠️  Failed to parse research JSON, using raw response');
      findings = { rawFindings: response.content };
    }

    this.log('✅ Research completed', {
      findingsCount: findings.findings?.length || 0
    });

    return this.createOutput(
      findings,
      'Comprehensive research findings from multiple sources',
      0.85,
      {
        findingsCount: findings.findings?.length || 0,
        toolsUsed: findings.toolsUsed || []
      }
    );
  }
}
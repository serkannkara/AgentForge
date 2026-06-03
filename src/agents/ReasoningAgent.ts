import { BaseAgent } from './BaseAgent';
import { AgentInput, AgentOutput, LLMMessage } from '../types';

/**
 * Reasoning Agent
 * Synthesizes information and creates structured insights
 */
export class ReasoningAgent extends BaseAgent {
  name = 'ReasoningAgent';
  role = 'Analysis and Synthesis';

  async execute(input: AgentInput): Promise<AgentOutput> {
    this.log('🧠 Starting reasoning phase...');
    this.log(`Analysis goal: ${input.goal}`);

    const previousContext = input.previousResults
      ? input.previousResults.map(r => ({
          agent: r.agentName,
          result: r.result
        }))
      : [];

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are a reasoning agent. Your job is to synthesize information and create actionable insights.

Output format (JSON):
{
  "strategy": {
    "title": "strategy title",
    "overview": "executive summary",
    "keyPillars": [
      {
        "name": "pillar name",
        "description": "what it is",
        "expectedImpact": "projected outcomes",
        "implementation": ["step 1", "step 2"]
      }
    ],
    "metrics": {
      "northStar": "primary metric",
      "leading": ["metric 1", "metric 2"],
      "lagging": ["metric 1", "metric 2"]
    },
    "timeline": {
      "phase1": "description",
      "phase2": "description"
    }
  },
  "reasoning": "detailed explanation",
  "confidence": 0.0-1.0
}

Guidelines:
- Be specific and actionable
- Back claims with data from research
- Consider trade-offs and risks
- Prioritize high-impact initiatives
- Think strategically about execution`
      },
      {
        role: 'user',
        content: `Synthesize this information into actionable strategy:\n\nGoal: ${input.goal}\n\nPrevious findings: ${JSON.stringify(previousContext)}\n\nCreate a comprehensive, actionable strategy.`
      }
    ];

    const response = await this.llm.generate(messages, {
      temperature: 0.7,
      maxTokens: 2500,
    });

    let strategy;
    try {
      strategy = JSON.parse(response.content);
    } catch (error) {
      this.log('⚠️  Failed to parse strategy JSON, using raw response');
      strategy = { rawStrategy: response.content };
    }

    this.log('✅ Strategy synthesized', {
      pillarsCount: strategy.strategy?.keyPillars?.length || 0
    });

    return this.createOutput(
      strategy,
      'Synthesized strategy based on research findings',
      strategy.confidence || 0.88,
      {
        pillarsCount: strategy.strategy?.keyPillars?.length || 0,
        hasMetrics: !!strategy.strategy?.metrics,
        hasTimeline: !!strategy.strategy?.timeline
      }
    );
  }
}
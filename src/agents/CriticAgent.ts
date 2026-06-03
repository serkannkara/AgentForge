import { BaseAgent } from './BaseAgent';
import { AgentInput, AgentOutput, LLMMessage } from '../types';

/**
 * Critic Agent
 * Reviews outputs for quality, identifies gaps, and suggests improvements
 */
export class CriticAgent extends BaseAgent {
  name = 'CriticAgent';
  role = 'Quality Assurance and Critical Analysis';

  async execute(input: AgentInput): Promise<AgentOutput> {
    this.log('🔬 Starting critique phase...');
    this.log(`Reviewing: ${input.goal}`);

    const previousWork = input.previousResults
      ? input.previousResults.map(r => ({
          agent: r.agentName,
          result: r.result,
          confidence: r.confidence
        }))
      : [];

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are a critic agent. Your job is to find weaknesses, gaps, and improvement opportunities.

Output format (JSON):
{
  "overallAssessment": "summary assessment",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": [
    {
      "issue": "problem description",
      "severity": "high|medium|low",
      "recommendation": "how to fix"
    }
  ],
  "missingElements": ["missing 1", "missing 2"],
  "recommendations": ["rec 1", "rec 2"],
  "revisedConfidence": 0.0-1.0,
  "nextSteps": "what should happen next"
}

Guidelines:
- Be constructively critical, not just negative
- Prioritize issues by severity
- Provide specific, actionable recommendations
- Look for logical gaps, unsupported claims, and risks
- Consider real-world implementation challenges
- Be thorough but fair`
      },
      {
        role: 'user',
        content: `Critique this work:\n\nGoal: ${input.goal}\n\nWork to review: ${JSON.stringify(previousWork)}\n\nProvide detailed, constructive critique.`
      }
    ];

    const response = await this.llm.generate(messages, {
      temperature: 0.6,
      maxTokens: 2000,
    });

    let critique;
    try {
      critique = JSON.parse(response.content);
    } catch (error) {
      this.log('⚠️  Failed to parse critique JSON, using raw response');
      critique = { rawCritique: response.content };
    }

    this.log('✅ Critique completed', {
      strengthsCount: critique.strengths?.length || 0,
      weaknessesCount: critique.weaknesses?.length || 0,
      revisedConfidence: critique.revisedConfidence
    });

    return this.createOutput(
      critique,
      'Critical analysis identifying strengths, weaknesses, and improvements',
      critique.revisedConfidence || 0.75,
      {
        strengthsCount: critique.strengths?.length || 0,
        weaknessesCount: critique.weaknesses?.length || 0,
        recommendationsCount: critique.recommendations?.length || 0
      }
    );
  }
}
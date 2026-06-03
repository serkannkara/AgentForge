import { BaseAgent } from './BaseAgent';
import { AgentInput, AgentOutput, LLMMessage } from '../types';

/**
 * Planner Agent
 * Breaks down high-level goals into structured, actionable tasks
 */
export class PlannerAgent extends BaseAgent {
  name = 'PlannerAgent';
  role = 'Strategic Planning and Task Decomposition';

  async execute(input: AgentInput): Promise<AgentOutput> {
    this.log('🎯 Starting planning phase...');
    this.log(`Goal: ${input.goal}`);

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are a strategic planning agent. Your job is to break down complex goals into structured, actionable tasks.

Output format (JSON):
{
  "goal": "restated goal",
  "tasks": [
    {
      "id": "task-1",
      "description": "clear task description",
      "dependencies": ["task-id"],
      "priority": "high|medium|low",
      "status": "pending",
      "assignedAgent": "AgentName"
    }
  ],
  "estimatedDuration": "time estimate",
  "reasoning": "explanation of plan"
}

Guidelines:
- Create 3-6 focused tasks
- Each task should have clear deliverables
- Identify dependencies between tasks
- Assign appropriate agents (PlannerAgent, ResearchAgent, ReasoningAgent, CriticAgent)
- Prioritize based on impact and dependencies`
      },
      {
        role: 'user',
        content: `Break down this goal into a structured plan:\n\nGoal: ${input.goal}\n\nContext: ${JSON.stringify(input.context)}`
      }
    ];

    const response = await this.llm.generate(messages, {
      temperature: 0.7,
      maxTokens: 1500,
    });

    let plan;
    try {
      plan = JSON.parse(response.content);
    } catch (error) {
      this.log('⚠️  Failed to parse plan JSON, using raw response');
      plan = { rawPlan: response.content };
    }

    this.log('✅ Plan created', plan);

    return this.createOutput(
      plan,
      'Structured plan with tasks, dependencies, and assignments',
      0.9,
      {
        taskCount: plan.tasks?.length || 0,
        estimatedDuration: plan.estimatedDuration
      }
    );
  }
}
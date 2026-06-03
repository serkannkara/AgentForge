import { WorkflowState } from './WorkflowState';
import { LLMProvider, Tool } from '../types';
import { PlannerAgent } from '../agents/PlannerAgent';
import { ResearchAgent } from '../agents/ResearchAgent';
import { ReasoningAgent } from '../agents/ReasoningAgent';
import { CriticAgent } from '../agents/CriticAgent';
import { MemoryStore } from '../memory/MemoryStore';

/**
 * Agent Orchestrator
 * Coordinates the multi-agent workflow
 */
export class AgentOrchestrator {
  private memoryStore: MemoryStore;

  private plannerAgent: PlannerAgent;
  private researchAgent: ResearchAgent;
  private reasoningAgent: ReasoningAgent;
  private criticAgent: CriticAgent;

  constructor(llmProvider: LLMProvider, tools: Tool[], memoryStore: MemoryStore) {
    this.memoryStore = memoryStore;

    this.plannerAgent = new PlannerAgent(llmProvider);
    this.researchAgent = new ResearchAgent(llmProvider, tools);
    this.reasoningAgent = new ReasoningAgent(llmProvider);
    this.criticAgent = new CriticAgent(llmProvider);
  }

  async execute(goal: string): Promise<WorkflowState> {
    const workflow = new WorkflowState(goal);

    console.log('\n🚀 ============================================');
    console.log('🚀 AgentForge Workflow Started');
    console.log('🚀 ============================================\n');
    console.log(`📝 Goal: ${goal}\n`);

    try {
      const context = await this.loadContext();

      await this.planPhase(workflow, context);

      await this.researchPhase(workflow, context);

      await this.reasoningPhase(workflow, context);

      await this.critiquePhase(workflow, context);

      workflow.complete();

      await this.saveResults(workflow);

      this.printSummary(workflow);

      return workflow;

    } catch (error: any) {
      console.error(`\n❌ Workflow failed: ${error.message}`);
      workflow.fail(error.message);
      return workflow;
    }
  }

  private async loadContext(): Promise<Record<string, any>> {
    console.log('📚 Loading context from memory...\n');
    
    const memories = await this.memoryStore.getAll();
    
    const context: Record<string, any> = {
      memories: memories.length,
      brand: memories.find(m => m.type === 'brand')?.content,
      marketContext: memories.find(m => m.type === 'context')?.content,
      insights: memories.filter(m => m.type === 'insight').map(m => m.content),
    };

    console.log(`✅ Loaded ${memories.length} memories from store\n`);

    return context;
  }

  private async planPhase(workflow: WorkflowState, context: Record<string, any>): Promise<void> {
    workflow.setPhase('planning');
    console.log('\n📋 ============================================');
    console.log('📋 PHASE 1: PLANNING');
    console.log('📋 ============================================\n');

    const output = await this.plannerAgent.execute({
      goal: workflow.goal,
      context,
    });

    workflow.addOutput(output);
  }

  private async researchPhase(workflow: WorkflowState, context: Record<string, any>): Promise<void> {
    workflow.setPhase('researching');
    console.log('\n🔍 ============================================');
    console.log('🔍 PHASE 2: RESEARCH');
    console.log('🔍 ============================================\n');

    const output = await this.researchAgent.execute({
      goal: workflow.goal,
      context,
      previousResults: workflow.agentOutputs,
    });

    workflow.addOutput(output);
  }

  private async reasoningPhase(workflow: WorkflowState, context: Record<string, any>): Promise<void> {
    workflow.setPhase('reasoning');
    console.log('\n🧠 ============================================');
    console.log('🧠 PHASE 3: REASONING');
    console.log('🧠 ============================================\n');

    const output = await this.reasoningAgent.execute({
      goal: workflow.goal,
      context,
      previousResults: workflow.agentOutputs,
    });

    workflow.addOutput(output);
  }

  private async critiquePhase(workflow: WorkflowState, context: Record<string, any>): Promise<void> {
    workflow.setPhase('critiquing');
    console.log('\n🔬 ============================================');
    console.log('🔬 PHASE 4: CRITIQUE');
    console.log('🔬 ============================================\n');

    const output = await this.criticAgent.execute({
      goal: workflow.goal,
      context,
      previousResults: workflow.agentOutputs,
    });

    workflow.addOutput(output);
  }

  private async saveResults(workflow: WorkflowState): Promise<void> {
    console.log('\n💾 Saving results to memory...');

    await this.memoryStore.save({
      type: 'insight',
      content: {
        goal: workflow.goal,
        results: workflow.agentOutputs.map(o => ({
          agent: o.agentName,
          summary: o.result,
          confidence: o.confidence
        })),
        completedAt: new Date().toISOString()
      },
      tags: ['workflow', 'completed'],
    });

    console.log('✅ Results saved\n');
  }

  private printSummary(workflow: WorkflowState): void {
    const summary = workflow.getSummary();

    console.log('\n✨ ============================================');
    console.log('✨ WORKFLOW SUMMARY');
    console.log('✨ ============================================\n');
    console.log(JSON.stringify(summary, null, 2));
    console.log('\n✅ Workflow completed successfully!\n');
  }
}
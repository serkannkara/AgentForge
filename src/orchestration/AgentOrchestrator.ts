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

  async execute(goal: string, options?: { maxRetries?: number }): Promise<WorkflowState> {
    const workflow = new WorkflowState(goal);
    const maxRetries = options?.maxRetries ?? 3;

    console.log('\n🚀 ============================================');
    console.log('🚀 AgentForge Workflow Started');
    console.log('🚀 ============================================\n');
    console.log(`📝 Goal: ${goal}\n`);

    try {
      const context = await this.loadContext();

      // Phase 1 with retry
      await this.executeWithRetry(
        () => this.planPhase(workflow, context),
        'Planning',
        maxRetries
      );

      // Phase 2 with retry
      await this.executeWithRetry(
        () => this.researchPhase(workflow, context),
        'Research',
        maxRetries
      );

      // Phase 3 with retry
      await this.executeWithRetry(
        () => this.reasoningPhase(workflow, context),
        'Reasoning',
        maxRetries
      );

      // Phase 4 with retry
      await this.executeWithRetry(
        () => this.critiquePhase(workflow, context),
        'Critique',
        maxRetries
      );

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

  private async executeWithRetry(
    fn: () => Promise<void>,
    phaseName: string,
    maxRetries: number
  ): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await fn();
        return; // Success
      } catch (error: any) {
        lastError = error;
        console.warn(`⚠️  ${phaseName} phase failed (attempt ${attempt}/${maxRetries}): ${error.message}`);
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          console.log(`   Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`${phaseName} phase failed after ${maxRetries} attempts: ${lastError?.message}`);
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
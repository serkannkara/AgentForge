import { WorkflowState as IWorkflowState, WorkflowPhase, AgentOutput, Memory } from '../types';

/**
 * Workflow State Manager
 * Tracks the state of the multi-agent workflow
 */
export class WorkflowState implements IWorkflowState {
  goal: string;
  currentPhase: WorkflowPhase;
  agentOutputs: AgentOutput[];
  memory: Memory[];
  metadata: Record<string, any>;
  startTime: Date;
  endTime?: Date;

  constructor(goal: string) {
    this.goal = goal;
    this.currentPhase = 'initialized';
    this.agentOutputs = [];
    this.memory = [];
    this.metadata = {};
    this.startTime = new Date();
  }

  addOutput(output: AgentOutput): void {
    this.agentOutputs.push(output);
    this.log(`Added output from ${output.agentName}`);
  }

  addMemory(memory: Memory): void {
    this.memory.push(memory);
  }

  setPhase(phase: WorkflowPhase): void {
    this.log(`Phase transition: ${this.currentPhase} → ${phase}`);
    this.currentPhase = phase;
  }

  complete(): void {
    this.endTime = new Date();
    this.currentPhase = 'completed';
    this.log('Workflow completed');
  }

  fail(error: string): void {
    this.endTime = new Date();
    this.currentPhase = 'failed';
    this.metadata.error = error;
    this.log(`Workflow failed: ${error}`);
  }

  getDuration(): number {
    const end = this.endTime || new Date();
    return end.getTime() - this.startTime.getTime();
  }

  getOutputByAgent(agentName: string): AgentOutput | undefined {
    return this.agentOutputs.find(o => o.agentName === agentName);
  }

  getSummary(): any {
    return {
      goal: this.goal,
      phase: this.currentPhase,
      agentsExecuted: this.agentOutputs.map(o => o.agentName),
      duration: `${Math.round(this.getDuration() / 1000)}s`,
      success: this.currentPhase === 'completed',
      outputsCount: this.agentOutputs.length,
    };
  }

  private log(message: string): void {
    console.log(`[WorkflowState] ${message}`);
  }
}
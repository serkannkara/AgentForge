/**
 * Core type definitions for AgentForge
 */

// Agent Types
export interface Agent {
  name: string;
  role: string;
  execute(input: AgentInput): Promise<AgentOutput>;
}

export interface AgentInput {
  goal: string;
  context: Record<string, any>;
  previousResults?: AgentOutput[];
}

export interface AgentOutput {
  agentName: string;
  result: any;
  reasoning?: string;
  confidence?: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// LLM Provider Types
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

export interface LLMProvider {
  generate(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

// Tool Types
export interface Tool {
  name: string;
  description: string;
  execute(params: ToolParams): Promise<ToolResult>;
}

export interface ToolParams {
  [key: string]: any;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// Memory Types
export interface Memory {
  id: string;
  type: 'project' | 'brand' | 'insight' | 'context';
  content: any;
  timestamp: Date;
  tags?: string[];
}

export interface MemoryStore {
  save(memory: Omit<Memory, 'id' | 'timestamp'>): Promise<Memory>;
  query(filter: MemoryFilter): Promise<Memory[]>;
  getAll(): Promise<Memory[]>;
  clear(): Promise<void>;
}

export interface MemoryFilter {
  type?: Memory['type'];
  tags?: string[];
  limit?: number;
}

// Workflow Types
export interface WorkflowState {
  goal: string;
  currentPhase: WorkflowPhase;
  agentOutputs: AgentOutput[];
  memory: Memory[];
  metadata: Record<string, any>;
  startTime: Date;
  endTime?: Date;
}

export type WorkflowPhase = 
  | 'initialized'
  | 'planning'
  | 'researching'
  | 'reasoning'
  | 'critiquing'
  | 'completed'
  | 'failed';

// Task Types (for Planner)
export interface Task {
  id: string;
  description: string;
  dependencies: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgent?: string;
}

export interface Plan {
  goal: string;
  tasks: Task[];
  estimatedDuration?: string;
  reasoning: string;
}
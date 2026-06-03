import { Memory, MemoryStore as IMemoryStore, MemoryFilter } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Simple JSON-based memory store for demo purposes
 * In production, consider using a vector database like Pinecone or Weaviate
 */
export class MemoryStore implements IMemoryStore {
  private memories: Memory[] = [];
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || path.join(__dirname, 'project-memory.json');
  }

  async initialize(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.memories = parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
      console.log(`📚 Loaded ${this.memories.length} memories from storage`);
    } catch (error) {
      console.log('📚 No existing memory file found, starting fresh');
      this.memories = [];
    }
  }

  async save(memory: Omit<Memory, 'id' | 'timestamp'>): Promise<Memory> {
    const newMemory: Memory = {
      ...memory,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.memories.push(newMemory);
    await this.persist();
    
    return newMemory;
  }

  async query(filter: MemoryFilter): Promise<Memory[]> {
    let results = [...this.memories];

    if (filter.type) {
      results = results.filter(m => m.type === filter.type);
    }

    if (filter.tags && filter.tags.length > 0) {
      results = results.filter(m => 
        m.tags && filter.tags!.some(tag => m.tags!.includes(tag))
      );
    }

    // Sort by most recent
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filter.limit) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  async getAll(): Promise<Memory[]> {
    return [...this.memories];
  }

  async clear(): Promise<void> {
    this.memories = [];
    await this.persist();
    console.log('🗑️  Memory cleared');
  }

  private async persist(): Promise<void> {
    try {
      const data = JSON.stringify(this.memories, null, 2);
      await fs.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      console.error('❌ Failed to persist memory:', error);
    }
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
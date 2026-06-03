import * as dotenv from 'dotenv';
import { MockLLMProvider } from '../llm/MockLLMProvider';
import { SearchTool } from '../tools/SearchTool';
import { DocumentTool } from '../tools/DocumentTool';
import { AnalyticsTool } from '../tools/AnalyticsTool';
import { MemoryStore } from '../memory/MemoryStore';
import { AgentOrchestrator } from '../orchestration/AgentOrchestrator';

dotenv.config();

/**
 * Example: AI-Native Growth Strategy for Language Learning App
 * 
 * This example demonstrates the full agentic AI workflow:
 * 1. Planner breaks down the goal into tasks
 * 2. Research agent gathers market information
 * 3. Reasoning agent synthesizes strategy
 * 4. Critic agent reviews and provides feedback
 */
async function main() {
  console.clear();
  
  console.log('\n🎨 ============================================');
  console.log('🎨 AgentForge Demo');
  console.log('🎨 Multi-Agent AI Workflow Orchestration');
  console.log('🎨 ============================================\n');

  const llmProvider = new MockLLMProvider();
  
  const tools = [
    new SearchTool(),
    new DocumentTool(),
    new AnalyticsTool(),
  ];

  const memoryStore = new MemoryStore();
  await memoryStore.initialize();

  const orchestrator = new AgentOrchestrator(llmProvider, tools, memoryStore);

  const goal = 'Analyze a language learning app and create an AI-native growth strategy';

  const workflow = await orchestrator.execute(goal);

  console.log('\n📊 ============================================');
  console.log('📊 FINAL RESULTS');
  console.log('📊 ============================================\n');

  workflow.agentOutputs.forEach((output, index) => {
    console.log(`\n${index + 1}. ${output.agentName}`);
    console.log(`   Confidence: ${((output.confidence || 0) * 100).toFixed(0)}%`);
    console.log(`   Timestamp: ${output.timestamp.toISOString()}`);
    
    if (output.reasoning) {
      console.log(`   Reasoning: ${output.reasoning}`);
    }
    
    console.log(`\n   Result Preview:`);
    const preview = JSON.stringify(output.result, null, 2);
    const truncated = preview.length > 500 ? preview.substring(0, 500) + '...' : preview;
    console.log(`   ${truncated}\n`);
  });

  console.log('\n🎉 ============================================');
  console.log('🎉 Demo Completed!');
  console.log('🎉 ============================================\n');
  console.log('Next steps:');
  console.log('- Review the output above');
  console.log('- Check src/memory/project-memory.json for saved results');
  console.log('- Explore the code in src/ to understand the architecture');
  console.log('- Try modifying the goal or adding new agents');
  console.log('- Read README.md for more information\n');

  process.exit(0);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
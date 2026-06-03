<div align="center">
 
 <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,20&height=120&section=header&text=AgentForge&fontSize=60&fontAlignY=25&animation=fadeIn&fontColor=fff" />
 
 <h3>Build Autonomous AI Agents, Workflows, and Multi-Agent Systems</h3>
 
 <p>
   <a href="https://github.com/serkankara/AgentForge/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
   <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.3-blue.svg" alt="TypeScript" /></a>
   <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg" alt="Node" /></a>
   <img src="https://img.shields.io/badge/status-experimental-orange.svg" alt="Status" />
 </p>
 
 <p>
   <strong>Reference implementation of multi-agent AI orchestration</strong><br />
   Plan → Research → Reason → Critique → Execute
 </p>
 
 <p>
   <a href="#-quick-start">Quick Start</a> •
   <a href="#-features">Features</a> •
   <a href="#-architecture">Architecture</a> •
   <a href="#-roadmap">Roadmap</a> •
   <a href="#-contributing">Contributing</a>
 </p>
 
 </div>
 
 ---
 
 ## 🎯 What is AgentForge?
 
 AgentForge is **not another chatbot wrapper**. It's a complete framework for building **agentic AI systems** that can:
 
 - 🧠 **Plan** complex tasks autonomously
 - 🔍 **Research** using external tools
 - 💡 **Reason** through problems systematically
 - 🔬 **Self-critique** and improve outputs
 - 🔄 **Orchestrate** multi-agent workflows
 
 Think of it as **AI Engineering infrastructure** for building agents that work like specialized teams.
 
 ---
 
 ## 🔄 Architecture
 
 ```mermaid
 graph TB
     User[👤 User Goal] --> Orchestrator[🎭 Agent Orchestrator]
     
     Orchestrator --> Memory[(💾 Memory Store)]
     
     Orchestrator --> Phase1[📋 Phase 1: Planning]
     Phase1 --> PlannerAgent[🎯 Planner Agent]
     PlannerAgent --> |Tasks & Dependencies| State1[Workflow State]
     
     Orchestrator --> Phase2[🔍 Phase 2: Research]
     Phase2 --> ResearchAgent[🔬 Research Agent]
     ResearchAgent --> Tools[🛠️ Tools]
     Tools --> SearchTool[🔎 Search Tool]
     Tools --> DocumentTool[📄 Document Tool]
     Tools --> AnalyticsTool[📊 Analytics Tool]
     ResearchAgent --> |Findings| State2[Workflow State]
     
     Orchestrator --> Phase3[🧠 Phase 3: Reasoning]
     Phase3 --> ReasoningAgent[💡 Reasoning Agent]
     ReasoningAgent --> |Strategy| State3[Workflow State]
     
     Orchestrator --> Phase4[🔬 Phase 4: Critique]
     Phase4 --> CriticAgent[✅ Critic Agent]
     CriticAgent --> |Review & Improvements| State4[Workflow State]
     
     State4 --> Result[✨ Final Output]
     
     LLM[🤖 LLM Provider<br/>Mock / OpenAI] -.->|Powers| PlannerAgent
     LLM -.->|Powers| ResearchAgent
     LLM -.->|Powers| ReasoningAgent
     LLM -.->|Powers| CriticAgent
     
     Memory -.->|Context| Orchestrator
     State4 -.->|Persist| Memory
     
     style User fill:#667eea
     style Orchestrator fill:#764ba2
     style Result fill:#10b981
     style Memory fill:#4facfe
     style LLM fill:#f093fb
 ```
 
 ---
 
 ## 🆚 Why AgentForge?
 
 | Traditional Chatbot | AgentForge |
 |---------------------|------------|
 | Single prompt | **Goal-based workflow** |
 | One LLM call | **Multi-phase orchestration** |
 | No memory | **Persistent context** |
 | No tools | **Extensible tool system** |
 | No critique | **Self-improving agents** |
 | No planning | **Task decomposition** |
 | Black box | **Observable workflow** |
 
 **Use AgentForge when you need:**
 - Autonomous task execution
 - Complex problem solving
 - Multi-step reasoning
 - Quality assurance through critique
 - Tool-augmented AI
 
 ---
 
 ## ✨ Features
 
 ### 🤖 Multi-Agent System
 
 - **Planner Agent** - Decomposes goals into structured tasks
 - **Research Agent** - Gathers information using tools
 - **Reasoning Agent** - Synthesizes insights into strategies
 - **Critic Agent** - Reviews outputs and suggests improvements
 
 ### 🛠️ Tool System
 
 - Extensible tool architecture
 - Built-in tools: Search, Document Analysis, Analytics
 - Easy to add custom tools
 - Type-safe tool definitions
 
 ### 💾 Memory Layer
 
 - JSON-based memory store (upgradable to vector DBs)
 - Context persistence across workflows
 - Brand/project memory support
 - Query and filter capabilities
 
 ### 🔄 Workflow Orchestration
 
 - Phase-based execution
 - State management
 - Error handling and recovery
 - Execution tracing and logging
 
 ### 🎭 LLM Provider Abstraction
 
 - Mock provider (no API key needed!)
 - OpenAI support (GPT-4, GPT-3.5)
 - Easy to add new providers
 - Consistent interface
 
 ---
 
 ## 🚀 Quick Start
 
 ### Installation
 
 ```bash
 # Clone the repository
 git clone https://github.com/serkankara/AgentForge.git
 cd AgentForge
 
 # Install dependencies
 npm install
 
 # Run the demo (no API key required!)
 npm run dev
 ```
 
 That's it! The demo runs with a **Mock LLM Provider** - no API keys needed.
 
 ### First Workflow
 
 ```typescript
 import { AgentOrchestrator, MockLLMProvider, MemoryStore } from 'agentforge';
 import { SearchTool, DocumentTool } from 'agentforge/tools';
 
 // Setup
 const llm = new MockLLMProvider();
 const tools = [new SearchTool(), new DocumentTool()];
 const memory = new MemoryStore();
 await memory.initialize();
 
 const orchestrator = new AgentOrchestrator(llm, tools, memory);
 
 // Execute
 const workflow = await orchestrator.execute(
   'Analyze competitor landscape and create growth strategy'
 );
 
 // Results
 console.log(workflow.getSummary());
 workflow.agentOutputs.forEach(output => {
   console.log(`${output.agentName}: ${output.result}`);
 });
 ```
 
 ---
 
 ## 📊 Example Output
 
 Here's what a real workflow execution looks like:
 
 ```
 🚀 ============================================
 🚀 AgentForge Workflow Started
 🚀 ============================================
 
 📝 Goal: Analyze a language learning app and create an AI-native growth strategy
 
 📚 Loading context from memory...
 ✅ Loaded 3 memories from store
 
 📋 ============================================
 📋 PHASE 1: PLANNING
 📋 ============================================
 
 [PlannerAgent] 🎯 Starting planning phase...
 [PlannerAgent] ✅ Plan created
 
 Tasks:
 - task-1: Research market landscape
 - task-2: Analyze AI-native opportunities
 - task-3: Synthesize growth strategy
 - task-4: Review and critique
 
 🔍 ============================================
 🔍 PHASE 2: RESEARCH
 🔍 ============================================
 
 [ResearchAgent] 🔍 Starting research phase...
 [ResearchAgent] ✅ Research completed
 
 Findings:
 - Market size: $12B+, growing 18% CAGR
 - Key players: Duolingo (60M+ MAU), Babbel, Rosetta Stone
 - AI integration accelerating
 
 🧠 ============================================
 🧠 PHASE 3: REASONING
 🧠 ============================================
 
 [ReasoningAgent] 🧠 Starting reasoning phase...
 [ReasoningAgent] ✅ Strategy synthesized
 
 Key Pillars:
 1. AI Conversation Engine (2-3x engagement)
 2. Hyper-Personalization (40% churn reduction)
 3. Viral Growth Mechanics (K-factor 1.5-2.0)
 
 🔬 ============================================
 🔬 PHASE 4: CRITIQUE
 🔬 ============================================
 
 [CriticAgent] 🔬 Starting critique phase...
 [CriticAgent] ✅ Critique completed
 
 Strengths: 4 identified
 Weaknesses: 5 identified
 Recommendations: 5 provided
 
 ✨ ============================================
 ✨ WORKFLOW SUMMARY
 ✨ ============================================
 
 Goal: ✅ Completed
 Duration: 4 seconds
 Agents: 4/4 executed
 Confidence: 75-90%
 Success: true
 
 ✅ Workflow completed successfully!
 ```
 
 ---
 
 ## 📁 Project Structure
 
 ```
 AgentForge/
 ├── src/
 │   ├── agents/              # Agent implementations
 │   │   ├── BaseAgent.ts     # Abstract base class
 │   │   ├── PlannerAgent.ts  # Task decomposition
 │   │   ├── ResearchAgent.ts # Information gathering
 │   │   ├── ReasoningAgent.ts# Insight synthesis
 │   │   └── CriticAgent.ts   # Quality review
 │   │
 │   ├── orchestration/       # Workflow management
 │   │   ├── AgentOrchestrator.ts  # Main orchestrator
 │   │   └── WorkflowState.ts      # State management
 │   │
 │   ├── memory/              # Memory system
 │   │   ├── MemoryStore.ts   # Storage implementation
 │   │   └── project-memory.json   # Demo data
 │   │
 │   ├── tools/               # Tool system
 │   │   ├── Tool.ts          # Base tool interface
 │   │   ├── SearchTool.ts    # Web search simulation
 │   │   ├── DocumentTool.ts  # Document analysis
 │   │   └── AnalyticsTool.ts # Analytics data
 │   │
 │   ├── llm/                 # LLM providers
 │   │   ├── LLMProvider.ts   # Provider interface
 │   │   ├── MockLLMProvider.ts    # Demo provider
 │   │   └── OpenAIProvider.ts     # OpenAI integration
 │   │
 │   ├── types/               # TypeScript types
 │   │   └── index.ts         # All type definitions
 │   │
 │   ├── examples/            # Example workflows
 │   │   └── runGrowthStrategyExample.ts
 │   │
 │   └── index.ts             # Main exports
 │
 ├── .github/                 # GitHub templates
 │   ├── workflows/ci.yml
 │   └── ISSUE_TEMPLATE/
 │
 ├── package.json
 ├── tsconfig.json
 ├── CONTRIBUTING.md
 ├── CHANGELOG.md
 ├── .gitignore
 ├── LICENSE
 └── README.md
 ```
 
 ### 🧩 Core Components
 
 #### Agents
 
 Each agent has a specific role in the workflow:
 
 - **PlannerAgent**: Breaks down goals into structured tasks with dependencies
 - **ResearchAgent**: Uses tools to gather information and insights
 - **ReasoningAgent**: Synthesizes research into actionable strategies
 - **CriticAgent**: Reviews work, identifies gaps, suggests improvements
 
 #### Tools
 
 Tools give agents access to external data and capabilities:
 
 ```typescript
 interface Tool {
   name: string;
   description: string;
   execute(params: ToolParams): Promise<ToolResult>;
 }
 ```
 
 Built-in tools:
 - **SearchTool**: Simulates web search
 - **DocumentTool**: Analyzes documents
 - **AnalyticsTool**: Provides analytics data
 
 #### Memory
 
 Persistent storage for context:
 
 ```typescript
 await memory.save({
   type: 'brand',
   content: { name: 'MyApp', industry: 'EdTech' },
   tags: ['brand', 'context']
 });
 
 const memories = await memory.query({ type: 'brand' });
 ```
 
 ---
 
 ## 🎓 How to Use
 
 ### Adding a New Agent
 
 ```typescript
 import { BaseAgent, AgentInput, AgentOutput } from 'agentforge';
 
 export class CustomAgent extends BaseAgent {
   name = 'CustomAgent';
   role = 'Does something amazing';
 
   async execute(input: AgentInput): Promise<AgentOutput> {
     this.log('Starting custom work...');
     
     // Your logic here
     const result = await this.processGoal(input.goal);
     
     return this.createOutput(
       result,
       'Explanation of what I did',
       0.9  // confidence score
     );
   }
 }
 ```
 
 ### Adding a New Tool
 
 ```typescript
 import { BaseTool, ToolParams, ToolResult } from 'agentforge';
 
 export class WeatherTool extends BaseTool {
   name = 'get_weather';
   description = 'Get weather for a location';
 
   async execute(params: ToolParams): Promise<ToolResult> {
     const { location } = params;
     
     if (!location) {
       return this.failure('location required');
     }
     
     const weather = await this.fetchWeather(location);
     
     return this.success({
       location,
       temperature: weather.temp,
       conditions: weather.conditions
     });
   }
 }
 ```
 
 ### Using OpenAI Instead of Mock
 
 ```typescript
 import { OpenAIProvider } from 'agentforge';
 
 // 1. Install OpenAI package
 // npm install openai
 
 // 2. Set API key
 // OPENAI_API_KEY=your_key in .env
 
 // 3. Use OpenAI provider
 const llm = new OpenAIProvider(process.env.OPENAI_API_KEY!);
 const orchestrator = new AgentOrchestrator(llm, tools, memory);
 ```
 
 ---
 
 ## 🗺️ Roadmap
 
 ### ✅ Completed
 - [x] Multi-agent system (Planner, Research, Reasoning, Critic)
 - [x] Workflow orchestration
 - [x] Memory layer (JSON-based)
 - [x] Tool system
 - [x] Mock LLM provider
 - [x] OpenAI provider structure
 - [x] TypeScript implementation
 - [x] Example workflows
 
 ### 🚧 In Progress
 - [ ] Real tool calling (function calling)
 - [ ] OpenAI provider implementation
 - [ ] Unit tests
 - [ ] Integration tests
 - [ ] CI/CD pipeline
 
 ### 📋 Planned (Production Readiness)
 - [ ] Comprehensive test coverage
 - [ ] Production-grade error handling
 - [ ] Vector database integration (Pinecone, Weaviate)
 - [ ] More LLM providers (Claude, Gemini, Llama)
 - [ ] RAG (Retrieval-Augmented Generation)
 - [ ] Human-in-the-loop workflows
 - [ ] Multi-agent collaboration (agents talking to each other)
 - [ ] Streaming output support
 - [ ] Web UI for workflow visualization
 - [ ] Retry logic and error recovery
 - [ ] Agent performance benchmarks
 - [ ] Plugin system / marketplace
 
 > **Note**: This is currently a reference implementation and experimental framework. Full production readiness requires completion of tests, real provider implementations, and production-grade error handling.
 
 ---
 
 ## 🤝 Contributing
 
 We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.
 
 Quick links:
 - [Report a bug](https://github.com/serkankara/AgentForge/issues/new?labels=bug)
 - [Request a feature](https://github.com/serkankara/AgentForge/issues/new?labels=enhancement)
 - [Submit a PR](https://github.com/serkankara/AgentForge/pulls)
 
 ---
 
 ## 📜 License
 
 MIT License - see [LICENSE](LICENSE) file for details.
 
 ---
 
 ## 🙏 Acknowledgments
 
 AgentForge is inspired by:
 - **AutoGPT** - Pioneering autonomous agents
 - **LangChain** - LLM application framework
 - **CrewAI** - Multi-agent orchestration
 - **AutoGen** - Microsoft's agent framework
 - **LangGraph** - Stateful agent graphs
 
 ---
 
 ## 📢 Share on Social Media
 
 Love AgentForge? Share it with your network!
 
 ### Twitter / X
 ```
 🚀 Just discovered AgentForge - an open-source multi-agent AI framework!
 
 Unlike chatbots, it:
 🧠 Plans tasks autonomously
 🔍 Researches with tools
 💡 Reasons through problems
 🔬 Self-critiques outputs
 
 Built with TypeScript. No API key needed for demo!
 
 ⭐ github.com/serkankara/AgentForge
 
 #AgenticAI #OpenSource #TypeScript #AI #MachineLearning #LLM #AIEngineering
 ```
 
 ### LinkedIn
 ```
 Excited to share AgentForge - a production-ready framework for building agentic AI systems 🤖
 
 What makes it different:
 ✅ Multi-agent orchestration (Planner, Research, Reasoning, Critic)
 ✅ Tool-augmented workflows
 ✅ Memory layer for context persistence
 ✅ Works without API keys (mock provider included)
 ✅ TypeScript + Clean Architecture
 
 Perfect for AI engineers building autonomous agents.
 
 Open source & MIT licensed.
 Star it: github.com/serkankara/AgentForge
 
 #ArtificialIntelligence #AI #OpenSource #TypeScript #MachineLearning #AgenticAI #SoftwareEngineering
 ```
 
 ---
 
 ## 🌟 Star History
 
 [![Star History Chart](https://api.star-history.com/svg?repos=serkankara/AgentForge&type=Date)](https://star-history.com/#serkankara/AgentForge&Date)
 
 ---
 
 <div align="center">
 
 **Built with ❤️ for the AI Engineering community**
 
 [⭐ Star us on GitHub](https://github.com/serkankara/AgentForge) • [🐦 Follow on Twitter](https://twitter.com/serkankarraa) • [💬 Join Discussions](https://github.com/serkankara/AgentForge/discussions)
 
 <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,20&height=100&section=footer" />
 
 </div>
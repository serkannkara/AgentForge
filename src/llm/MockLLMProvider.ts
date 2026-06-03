import { BaseLLMProvider } from './LLMProvider';
import { LLMMessage, LLMResponse, LLMOptions } from '../types';

/**
 * Mock LLM Provider for demo purposes
 * Returns realistic responses without requiring an API key
 */
export class MockLLMProvider extends BaseLLMProvider {
  constructor() {
    super();
  }

  async generate(messages: LLMMessage[], _options?: LLMOptions): Promise<LLMResponse> {
    // Simulate API latency
    await this.simulateDelay(500, 1500);

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const content = this.generateResponse(lastUserMessage?.content || '', messages);

    return {
      content,
      usage: {
        promptTokens: this.estimateTokens(messages),
        completionTokens: this.estimateTokens([{ role: 'assistant', content }]),
        totalTokens: 0, // Will be calculated
      },
      model: 'mock-gpt-4',
    };
  }

  private generateResponse(userMessage: string, _allMessages: LLMMessage[]): string {
    const lowerMessage = userMessage.toLowerCase();

    // Detect intent from message
    if (lowerMessage.includes('break') && lowerMessage.includes('task')) {
      return this.generatePlanResponse();
    } else if (lowerMessage.includes('research') || lowerMessage.includes('gather')) {
      return this.generateResearchResponse();
    } else if (lowerMessage.includes('synthesize') || lowerMessage.includes('analyze')) {
      return this.generateReasoningResponse();
    } else if (lowerMessage.includes('critique') || lowerMessage.includes('review')) {
      return this.generateCritiqueResponse();
    }

    return this.generateGenericResponse();
  }

  private generatePlanResponse(): string {
    return JSON.stringify({
      goal: "Analyze language learning app and create AI-native growth strategy",
      tasks: [
        {
          id: "task-1",
          description: "Research current language learning app market landscape",
          dependencies: [],
          priority: "high",
          status: "pending",
          assignedAgent: "ResearchAgent"
        },
        {
          id: "task-2",
          description: "Analyze AI-native growth opportunities and strategies",
          dependencies: ["task-1"],
          priority: "high",
          status: "pending",
          assignedAgent: "ResearchAgent"
        },
        {
          id: "task-3",
          description: "Synthesize findings into actionable growth strategy",
          dependencies: ["task-2"],
          priority: "medium",
          status: "pending",
          assignedAgent: "ReasoningAgent"
        },
        {
          id: "task-4",
          description: "Review strategy for gaps and improvements",
          dependencies: ["task-3"],
          priority: "medium",
          status: "pending",
          assignedAgent: "CriticAgent"
        }
      ],
      estimatedDuration: "15-20 minutes",
      reasoning: "Breaking down the goal into research, analysis, synthesis, and review phases ensures comprehensive coverage while maintaining quality through critique loops."
    }, null, 2);
  }

  private generateResearchResponse(): string {
    return JSON.stringify({
      findings: [
        {
          topic: "Language Learning Market Overview",
          insights: [
            "Market size: $12B+ globally, growing at 18% CAGR",
            "Key players: Duolingo (60M+ MAU), Babbel, Rosetta Stone",
            "AI integration is accelerating - conversational AI, speech recognition",
            "Mobile-first approach dominates with 85% of usage on apps"
          ],
          sources: ["Market Research Report 2024", "App Analytics Data"],
          confidence: 0.9
        },
        {
          topic: "AI-Native Growth Opportunities",
          insights: [
            "Personalized AI tutors show 2.3x better retention vs traditional methods",
            "Real-time conversation practice is the #1 requested feature",
            "Gamification + AI = 40% increase in daily active users",
            "Voice AI quality is now indistinguishable from native speakers"
          ],
          sources: ["EdTech Trends 2024", "User Behavior Studies"],
          confidence: 0.85
        },
        {
          topic: "User Pain Points",
          insights: [
            "Lack of real conversation practice (mentioned by 78% of users)",
            "Generic learning paths don't adapt to individual needs",
            "Limited feedback on pronunciation and grammar in context",
            "Expensive 1-on-1 tutoring ($30-50/hr) creates barrier"
          ],
          sources: ["User Surveys", "App Store Reviews Analysis"],
          confidence: 0.95
        }
      ],
      methodology: "Multi-source research combining market reports, user data, and competitive analysis",
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  private generateReasoningResponse(): string {
    return JSON.stringify({
      strategy: {
        title: "AI-Native Growth Strategy for Language Learning App",
        overview: "Leverage AI to create a personalized, conversation-first learning experience that addresses core user pain points while driving viral growth through demonstrable results.",
        keyPillars: [
          {
            name: "AI Conversation Engine",
            description: "Real-time AI tutors that simulate natural conversations in 50+ scenarios",
            expectedImpact: "2-3x increase in user engagement and retention",
            implementation: [
              "Deploy GPT-4 based conversation agents with personality",
              "Implement real-time pronunciation feedback using Whisper AI",
              "Create adaptive difficulty based on user performance",
              "Add emotional intelligence to conversations for natural flow"
            ]
          },
          {
            name: "Hyper-Personalization",
            description: "AI-driven learning paths that adapt in real-time to user progress and interests",
            expectedImpact: "40% reduction in churn, 60% faster proficiency gains",
            implementation: [
              "Build user modeling system tracking learning patterns",
              "Implement content recommendation engine",
              "Create dynamic curriculum that adjusts daily",
              "Personalize examples based on user interests/profession"
            ]
          },
          {
            name: "Viral Growth Mechanics",
            description: "AI-powered features that encourage organic sharing and word-of-mouth",
            expectedImpact: "K-factor of 1.5-2.0, reducing CAC by 70%",
            implementation: [
              "AI-generated shareable progress reports",
              "Challenge friends feature with AI referee",
              "Success stories showcasing before/after fluency",
              "Referral rewards tied to friend's achievements"
            ]
          }
        ],
        metrics: {
          northStar: "Weekly Active Conversations per User",
          leading: ["Daily Active Users", "Session Length", "Lesson Completion Rate"],
          lagging: ["3-Month Retention", "NPS Score", "Word-of-Mouth Coefficient"]
        },
        timeline: {
          "Month 1-2": "Launch AI conversation MVP with 10 scenarios",
          "Month 3-4": "Deploy personalization engine and A/B test",
          "Month 5-6": "Roll out viral mechanics and referral program",
          "Month 7+": "Scale and optimize based on data"
        }
      },
      reasoning: "This strategy addresses the three core user pain points (lack of conversation practice, non-personalized content, high cost) while creating viral loops through demonstrable AI-powered results. The conversation-first approach differentiates from competitors and leverages the latest AI capabilities to deliver 10x better outcomes at 1/10th the cost of human tutors.",
      confidence: 0.88
    }, null, 2);
  }

  private generateCritiqueResponse(): string {
    return JSON.stringify({
      overallAssessment: "Strong strategy with clear differentiation, but several areas need strengthening before execution",
      strengths: [
        "Addresses genuine user pain points with AI-native solutions",
        "Clear metrics and timeline for accountability",
        "Viral mechanics are well thought out",
        "Realistic impact estimates based on market data"
      ],
      weaknesses: [
        {
          issue: "Underestimating AI hallucination risks in language teaching",
          severity: "high",
          recommendation: "Add human-in-the-loop verification for grammatical correctness. Implement confidence thresholds where AI defers to pre-verified content for critical grammar rules."
        },
        {
          issue: "No clear monetization strategy mentioned",
          severity: "high",
          recommendation: "Define premium tiers: Free (5 AI conversations/week), Premium ($9.99/mo for unlimited), Enterprise ($299/mo for teams with analytics)."
        },
        {
          issue: "Timeline might be aggressive for AI conversation quality",
          severity: "medium",
          recommendation: "Add 2-4 weeks for fine-tuning conversation models on language-specific datasets before launch. Quality is critical for retention."
        },
        {
          issue: "Missing competitive moat discussion",
          severity: "medium",
          recommendation: "Duolingo and others will copy this. Build data moat through user interaction logs to improve AI models. First-mover advantage = better AI through more data."
        },
        {
          issue: "Regulatory compliance for children's data not addressed",
          severity: "medium",
          recommendation: "If targeting users under 13, ensure COPPA compliance. Consider age-gating AI features or separate parental consent flows."
        }
      ],
      missingElements: [
        "Customer acquisition cost (CAC) projections",
        "Team requirements and hiring plan",
        "Infrastructure costs for AI at scale",
        "Fallback strategy if AI quality doesn't meet expectations",
        "Competitive response scenarios"
      ],
      recommendations: [
        "Start with 3-5 high-quality conversation scenarios rather than 10 mediocre ones",
        "Run small beta with 100 users before scaling to validate AI quality",
        "Partner with language teachers for AI training and validation",
        "Build kill switches for AI features if quality degrades",
        "Create content moderation system for user-generated scenarios"
      ],
      revisedConfidence: 0.75,
      nextSteps: "Address high-severity weaknesses, then proceed to execution planning with detailed resource requirements and risk mitigation strategies."
    }, null, 2);
  }

  private generateGenericResponse(): string {
    return "I understand your request. As a mock LLM provider, I'm providing simulated responses. In a production environment, this would connect to a real LLM like GPT-4.";
  }

  private async simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private estimateTokens(messages: LLMMessage[]): number {
    const text = this.formatMessages(messages);
    return Math.ceil(text.length / 4); // Rough approximation
  }
}
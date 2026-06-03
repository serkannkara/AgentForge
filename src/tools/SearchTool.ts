import { BaseTool } from './Tool';
import { ToolParams, ToolResult } from '../types';

/**
 * Mock Search Tool
 * Simulates web search functionality
 */
export class SearchTool extends BaseTool {
  name = 'search';
  description = 'Search for information on the web. Provide a query string.';

  async execute(params: ToolParams): Promise<ToolResult> {
    const { query } = params;

    if (!query || typeof query !== 'string') {
      return this.failure('Query parameter is required and must be a string');
    }

    await this.simulateDelay(800, 1500);

    const results = this.getMockResults(query);

    return this.success({
      query,
      results,
      totalResults: results.length,
    });
  }

  private getMockResults(query: string): any[] {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('language learning') || lowerQuery.includes('duolingo')) {
      return [
        {
          title: 'Language Learning Market Report 2024',
          snippet: 'The global language learning market is valued at $12.49 billion and expected to grow at 18.7% CAGR through 2030...',
          url: 'https://example.com/market-report-2024',
          relevance: 0.95
        },
        {
          title: 'Duolingo Q4 2023 Earnings Report',
          snippet: 'Duolingo reported 60M+ monthly active users with AI features driving 40% increase in daily engagement...',
          url: 'https://investors.duolingo.com/q4-2023',
          relevance: 0.92
        },
        {
          title: 'AI in Education: Language Learning Revolution',
          snippet: 'AI-powered conversation practice shows 2.3x better retention rates compared to traditional methods...',
          url: 'https://edtech-research.com/ai-language-learning',
          relevance: 0.88
        }
      ];
    }

    if (lowerQuery.includes('ai') || lowerQuery.includes('growth')) {
      return [
        {
          title: 'AI-Native Growth Strategies for Consumer Apps',
          snippet: 'Companies leveraging AI for personalization see 60% higher retention and 2x referral rates...',
          url: 'https://growth-insights.com/ai-strategies',
          relevance: 0.94
        },
        {
          title: 'Viral Mechanics in AI Products',
          snippet: 'AI-generated shareable content drives K-factors of 1.5-2.0 in successful consumer apps...',
          url: 'https://product-growth.io/viral-ai',
          relevance: 0.89
        }
      ];
    }

    return [
      {
        title: `Search Results for: ${query}`,
        snippet: 'Mock search result. In production, this would call a real search API.',
        url: 'https://example.com/search',
        relevance: 0.5
      }
    ];
  }

  private async simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
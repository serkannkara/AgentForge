import { Tool, ToolParams, ToolResult } from '../types';

/**
 * Base Tool class
 * All tools inherit from this
 */
export abstract class BaseTool implements Tool {
  abstract name: string;
  abstract description: string;

  abstract execute(params: ToolParams): Promise<ToolResult>;

  protected success(data: any, metadata?: Record<string, any>): ToolResult {
    return {
      success: true,
      data,
      metadata,
    };
  }

  protected failure(error: string, metadata?: Record<string, any>): ToolResult {
    return {
      success: false,
      error,
      metadata,
    };
  }
}
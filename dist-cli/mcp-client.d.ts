/**
 * MCP Client - Interface to Python MCP Server
 * Provides tool calling capabilities for chat session
 */
import { EventEmitter } from 'events';
export interface MCPTool {
    name: string;
    description: string;
    parameters: any;
}
export interface MCPToolCall {
    tool: string;
    arguments: Record<string, any>;
}
export interface MCPToolResult {
    success: boolean;
    result: string;
    error?: string;
}
export declare class MCPClient extends EventEmitter {
    private pythonPath;
    private serverPath?;
    private process;
    private isRunning;
    private responseHandlers;
    private requestId;
    constructor(pythonPath?: string, serverPath?: string | undefined);
    start(): Promise<void>;
    private setupMessageHandling;
    private handleMessage;
    callTool(toolName: string, args: Record<string, any>): Promise<MCPToolResult>;
    listTools(): Promise<MCPTool[]>;
    stop(): Promise<void>;
    getStatus(): boolean;
}

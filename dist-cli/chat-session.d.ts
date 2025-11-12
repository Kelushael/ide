/**
 * Interactive Chat Session with Ollama
 * Handles conversation history and context management
 */
export declare class ChatSession {
    private ollama;
    private messages;
    private supabase;
    private sessionId;
    private mcpEnabled;
    private mcpClient;
    private writeMode;
    constructor(mcpEnabled?: boolean, writeMode?: boolean);
    start(): Promise<void>;
    private chatLoop;
    private handleCommand;
    private detectAndExecute;
    private saveMessage;
}

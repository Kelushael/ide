/**
 * Sovereign-First Chat Session
 * Ollama by default, Claude optional
 */
export declare class SovereignChatSession {
    private provider;
    private messages;
    private supabase;
    private sessionId;
    private writeMode;
    constructor(writeMode?: boolean);
    private displayWelcomeScreen;
    start(): Promise<void>;
    private chatLoop;
    private handleCommand;
    private showConfig;
    private switchMode;
    private handleTrustCommand;
    private showHelp;
    private detectAndExecute;
    private saveMessage;
}

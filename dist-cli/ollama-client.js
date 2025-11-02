/**
 * Ollama Client - Local LLM Integration
 * Handles streaming responses from Ollama
 */
export class OllamaClient {
    baseUrl;
    model;
    constructor(baseUrl = 'http://localhost:11434', model = 'dolphin-mistral:7b-v2.6') {
        this.baseUrl = baseUrl;
        this.model = model;
    }
    async *chatStream(messages) {
        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                messages,
                stream: true,
                options: {
                    temperature: 0.7,
                    num_ctx: 8192, // Context window
                }
            })
        });
        if (!response.ok) {
            throw new Error(`Ollama error: ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const data = JSON.parse(line);
                        if (data.message?.content) {
                            yield data.message.content;
                        }
                    }
                    catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
    async chat(messages) {
        let fullResponse = '';
        for await (const chunk of this.chatStream(messages)) {
            fullResponse += chunk;
        }
        return fullResponse;
    }
    async isAvailable() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET'
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    async listModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            const data = await response.json();
            return data.models?.map((m) => m.name) || [];
        }
        catch {
            return [];
        }
    }
}

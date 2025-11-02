import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Save } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AVAILABLE_TOOLS = [
  'file',
  'npm',
  'git',
  'docker',
  'postgres',
  'execute',
  'test',
  'cloud',
];

export default function AgentCreator() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [tier, setTier] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [price, setPrice] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function toggleTool(tool: string) {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const agentData = {
      name,
      slug: generateSlug(name),
      description,
      system_prompt: systemPrompt,
      tools: selectedTools,
      tier,
      price: tier === 'free' ? 0 : price * 100,
      is_public: isPublic,
      creator_id: 'anonymous',
    };

    const { error } = await supabase.from('agents').insert(agentData);

    if (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent: ' + error.message);
    } else {
      setSuccess(true);
      setName('');
      setDescription('');
      setSystemPrompt('');
      setSelectedTools([]);
      setTier('free');
      setPrice(0);
      setIsPublic(true);

      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Create Your Agent</h1>
          <p className="text-xl text-slate-300">
            Build specialized AI agents and share them with the community
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Free agents strengthen the network. Pro agents earn you 70% revenue.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., React Pro, API Builder, Bug Hunter"
                required
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              {name && (
                <p className="text-xs text-slate-400 mt-1">
                  Slug: {generateSlug(name)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this agent do? What problems does it solve?"
                required
                rows={3}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                System Prompt *
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are an expert in... Your role is to... You should..."
                required
                rows={6}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">
                This defines your agent's personality, expertise, and behavior
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Available Tools
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AVAILABLE_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedTools.includes(tool)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tier
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTier('free');
                      setPrice(0);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      tier === 'free'
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('pro')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      tier === 'pro'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    Pro
                  </button>
                </div>
              </div>

              {tier !== 'free' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="1"
                    step="1"
                    placeholder="10"
                    className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    You earn 70%, platform takes 30%
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-900 border-slate-700"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-300">
                Publish to marketplace (recommended)
              </label>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={saving || !name || !description || !systemPrompt}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Creating Agent...' : 'Create Agent'}
            </button>
          </div>

          {success && (
            <div className="mt-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg p-4 text-center">
              Agent created successfully! It's now available in the marketplace.
            </div>
          )}
        </form>

        <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Tips for Great Agents</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                <strong>Be specific:</strong> "React expert with TypeScript" beats "Frontend
                developer"
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                <strong>Set clear boundaries:</strong> Define what the agent should and
                shouldn't do
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                <strong>Choose tools wisely:</strong> Only enable tools your agent actually
                needs
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                <strong>Start free:</strong> Build trust and user base before charging
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                <strong>Iterate:</strong> Watch usage patterns and improve your agent over
                time
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

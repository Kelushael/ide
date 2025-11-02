import React, { useState, useEffect } from 'react';
import { Download, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  system_prompt: string;
  tools: string[];
  tier: 'free' | 'pro' | 'enterprise';
  price: number;
  install_count: number;
  rating: number;
  is_public: boolean;
  created_at: string;
}

export default function AgentMarketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, [filter]);

  async function loadAgents() {
    setLoading(true);
    let query = supabase
      .from('agents')
      .select('*')
      .eq('is_public', true)
      .order('install_count', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('tier', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading agents:', error);
    } else {
      setAgents(data || []);
    }
    setLoading(false);
  }

  async function installAgent(agent: Agent) {
    const { error } = await supabase
      .from('agent_installs')
      .insert({ agent_id: agent.id, user_id: 'anonymous' });

    if (error) {
      console.error('Error installing agent:', error);
    } else {
      alert(`${agent.name} installed! This agent is now ready to use.`);
      loadAgents();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Agent Marketplace
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            The unstealable ecosystem. Free forever.
          </p>
          <p className="text-sm text-slate-400">
            Every install makes the network stronger. Copy = Distribution.
          </p>
        </header>

        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Agents
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'free'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setFilter('pro')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'pro'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Pro
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading agents...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition cursor-pointer"
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {agent.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agent.tier === 'free'
                          ? 'bg-green-500/20 text-green-400'
                          : agent.tier === 'pro'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {agent.tier.toUpperCase()}
                      {agent.price > 0 && ` - $${(agent.price / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {agent.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{agent.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{agent.install_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{agent.tools.length} tools</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    installAgent(agent);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Agent
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedAgent && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAgent(null)}
          >
            <div
              className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedAgent.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAgent.tier === 'free'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedAgent.tier === 'pro'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {selectedAgent.tier.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-slate-300 mb-6">{selectedAgent.description}</p>

              <div className="bg-slate-900 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  System Prompt
                </h4>
                <p className="text-sm text-slate-300 font-mono">
                  {selectedAgent.system_prompt}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Available Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{selectedAgent.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{selectedAgent.install_count.toLocaleString()} installs</span>
                </div>
              </div>

              <button
                onClick={() => {
                  installAgent(selectedAgent);
                  setSelectedAgent(null);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Install {selectedAgent.name}
              </button>
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-slate-400 text-sm">
          <p className="mb-2">
            Built on the principle: <span className="text-blue-400 font-medium">Make it so free, stealing becomes pointless</span>
          </p>
          <p>
            Every install strengthens the network. Copy = Distribution. Open source = Unstealable.
          </p>
        </footer>
      </div>
    </div>
  );
}

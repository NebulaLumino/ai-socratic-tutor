'use client';

import { useState } from 'react';

const ACCENT = 'from-blue-600 to-indigo-600';

export default function SocraticTutor() {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResponse('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, question }),
    });
    const data = await res.json();
    setResponse(data.output || data.error || 'No response');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className={`text-3xl font-bold bg-gradient-to-r ${ACCENT} bg-clip-text text-transparent`}>
          🧠 AI Socratic Tutor
        </h1>
        <p className="text-gray-400 text-sm">Ask a question about any topic — the tutor will guide you with questions, not answers.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Topic or Subject</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, World War II, Calculus"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Question (optional)</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What do you want to explore?"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            onClick={ask}
            disabled={loading || !topic.trim()}
            className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r ${ACCENT} hover:opacity-90 disabled:opacity-40 transition`}
          >
            {loading ? 'Thinking...' : 'Ask the Tutor'}
          </button>
        </div>

        {response && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">💬 Response</h3>
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </div>
    </main>
  );
}

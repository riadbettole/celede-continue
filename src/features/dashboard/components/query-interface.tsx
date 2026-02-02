"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { queryKnowledgeBase } from "../actions/query-action";
import { Button } from "@/shared/components/ui/button";

export function QueryInterface() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    citations: Array<{ content: string; location?: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await queryKnowledgeBase(query);

      if (response.success) {
        setResult({
          answer: response.answer || "",
          citations: response.citations || [],
        });
      } else {
        setError(response.error || "Query failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Query Knowledge Base
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ask a question
          </label>
          <div className="flex gap-2">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to know?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">Answer:</h3>
            <p className="text-gray-800">{result.answer}</p>
          </div>

          {result.citations.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                Sources ({result.citations.length}):
              </h3>
              <div className="space-y-2">
                {result.citations.map((citation, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-gray-700">{citation.content}</p>
                    {citation.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        {citation.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
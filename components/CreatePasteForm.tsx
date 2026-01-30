

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreatePasteForm() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdPaste, setCreatedPaste] = useState<{ id: string; url: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    setIsLoading(true);

    try {
      const payload: any = { 
        content: content.trim() 
      };
      
      if (ttlSeconds && !isNaN(Number(ttlSeconds))) {
        payload.ttl_seconds = parseInt(ttlSeconds);
      }
      if (maxViews && !isNaN(Number(maxViews))) {
        payload.max_views = parseInt(maxViews);
      }

      console.log('Sending payload:', payload);
      
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || `Failed to create paste: ${response.status}`);
      }

      setCreatedPaste(data);
      toast.success('Paste created successfully!');
      
      // Reset form
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (error) {
      console.error('Error creating paste:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create paste');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Paste</h1>
      
      {createdPaste && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-semibold text-green-800 mb-2">✅ Paste created successfully!</p>
          <p className="mb-2">
            <span className="font-medium">URL:</span>{' '}
            <a 
              href={createdPaste.url}
              className="text-blue-600 hover:text-blue-800 break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {createdPaste.url}
            </a>
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(createdPaste.url);
              toast.success('URL copied to clipboard!');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            📋  Copy THE URL
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your content here..."
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">Required field</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-2">
              Time to Live (seconds) - optional
            </label>
            <input
              type="number"
              id="ttl"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              min="1"
              placeholder="e.g., 3600 for 1 hour"
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">Paste will expire after this many seconds</p>
          </div>

          <div>
            <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Views - optional
            </label>
            <input
              type="number"
              id="maxViews"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              min="1"
              placeholder="e.g., 10"
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">Paste will be unavailable after this many views</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Paste'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Enter your text content (required)</li>
          <li>• Optionally set expiry time (in seconds)</li>
          <li>• Optionally set maximum view count</li>
          <li>• Get a shareable URL</li>
          <li>• Paste becomes unavailable when constraints are met</li>
        </ul>
      </div>
    </div>
  );
}
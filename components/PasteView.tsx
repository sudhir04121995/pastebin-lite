
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface PasteData {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

interface PasteViewProps {
  id: string;
}

export default function PasteView({ id }: PasteViewProps) {
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid paste ID');
      setIsLoading(false);
      return;
    }

    const fetchPaste = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching paste with ID:', id);
        
        const response = await fetch(`/api/pastes/${id}`);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Paste not found or unavailable');
          } else {
            throw new Error(data.error || `Failed to fetch paste: ${response.status}`);
          }
          return;
        }

        setPaste(data);
      } catch (error) {
        console.error('Error fetching paste:', error);
        setError('Failed to load paste');
        toast.error('Failed to load paste');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Paste Unavailable</h2>
          <p className="text-red-600 mb-4">{error || 'Paste not found'}</p>
          <p className="text-gray-600 mb-4">
            This paste may have expired, reached its view limit, or been deleted.
          </p>
          <a 
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Create New Paste
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paste.remaining_views !== null && (
            <div>
              <span className="font-medium">Remaining Views:</span>{' '}
              <span className="text-blue-600 font-semibold">
                {paste.remaining_views}
              </span>
            </div>
          )}
          {paste.expires_at && (
            <div>
              <span className="font-medium">Expires:</span>{' '}
              <span className="text-blue-600 font-semibold">
                {new Date(paste.expires_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Paste ID: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Paste Content</h2>
        </div>
        <div className="p-6">
          <pre className="whitespace-pre-wrap font-mono text-gray-800 bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            {paste.content}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => {
            navigator.clipboard.writeText(paste.content);
            toast.success('Content copied to clipboard!');
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Copy Content
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('URL copied to clipboard!');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Copy URL
        </button>
        <a
          href="/"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Paste
        </a>
      </div>
    </div>
  );
}
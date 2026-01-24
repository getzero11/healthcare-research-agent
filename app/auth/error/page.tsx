'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-slate-300 mb-6">
            {error === 'OAuthCallback' && 'There was an issue with the OAuth callback.'}
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'Access was denied.'}
            {!error && 'An unknown authentication error occurred.'}
          </p>
          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
            >
              Return to Home
            </Link>
            <p className="text-sm text-slate-400">
              Error code: {error || 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
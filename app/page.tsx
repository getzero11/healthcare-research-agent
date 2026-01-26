'use client'

import { useState } from 'react'
import { 
  Search, 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users
} from 'lucide-react'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [reportData, setReportData] = useState<{
    pdfUrl?: string
    driveUrl?: string
  } | null>(null)

  const handleGenerateReport = async () => {
    if (!keyword.trim()) return
    
    setIsGenerating(true)
    setStatus('processing')
    setMessage('Starting report generation...')
    setReportData(null)
    
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword.trim() }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }
      
      setMessage('Report generation started! Processing in background...')
      
      // Start polling for completion (add "Global" prefix and "Market" suffix to match n8n processing)
      pollForCompletion("Global " + keyword.trim() + " Market")
      
    } catch (error) {
      console.error('Error generating report:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const pollForCompletion = async (reportKeyword: string) => {
    const maxAttempts = 60 // Poll for up to 5 minutes (60 * 5 seconds)
    let attempts = 0
    
    const poll = async () => {
      try {
        attempts++
        
        const response = await fetch(`/api/webhook/n8n-callback?keyword=${encodeURIComponent(reportKeyword)}`)
        const data = await response.json()
        
        if (response.ok && data.status === 'completed') {
          setStatus('completed')
          setMessage('Report generated successfully!')
          setReportData({
            pdfUrl: data.pdfUrl,
            driveUrl: data.driveUrl
          })
          return
        }
        
        if (data.status === 'error') {
          setStatus('error')
          setMessage(data.error || 'Report generation failed')
          return
        }
        
        // Continue polling if still processing and haven't exceeded max attempts
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Poll every 5 seconds
        } else {
          setStatus('error')
          setMessage('Report generation timed out. Please try again.')
        }
        
      } catch (error) {
        console.error('Error polling for completion:', error)
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Continue polling on error
        } else {
          setStatus('error')
          setMessage('Failed to check report status')
        }
      }
    }
    
    // Start polling after a short delay
    setTimeout(poll, 5000)
  }

  const handleDownload = async (pdfUrl: string, keyword: string) => {
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${keyword.replace(/\s+/g, '_')}_Market_Research_Report.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="healthcare-gradient p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">iHealthcareAnalyst</h1>
                <p className="text-sm text-slate-400">Market Research Agent</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-300">
                Healthcare Market Research Generator
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            AI-Powered Healthcare Market Research
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Generate comprehensive market research reports with intelligent insights, 
            market sizing, competitive analysis, and forecasts for any healthcare sector.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-slate-400 mb-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Market Forecasts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-400" />
              <span>Competitive Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span>Visual Infographics</span>
            </div>
          </div>
        </div>

        {/* Main Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
            <div className="mb-6">
              <label htmlFor="keyword" className="block text-sm font-medium text-slate-300 mb-2">
                Healthcare Market Keyword
              </label>
              <div className="relative">
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., Digital Diagnostics, Robotic Surgery, Digital Therapeutics"
                  className="w-full px-4 py-3 pl-12 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-400"
                  onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleGenerateReport()}
                  disabled={isGenerating}
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
            
            <button
              onClick={handleGenerateReport}
              disabled={!keyword.trim() || isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  <span>Generate Market Research Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Display */}
        {status !== 'idle' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Report Status: {keyword}
                </h3>
                <div className="flex items-center space-x-2">
                  {status === 'processing' && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                      <span className="text-sm text-blue-400">Processing...</span>
                    </>
                  )}
                  {status === 'completed' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-green-400">Completed</span>
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <span className="text-sm text-red-400">Failed</span>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-slate-300 mb-4">{message}</p>
              
              {status === 'processing' && (
                <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full pulse-animation" style={{width: '60%'}}></div>
                </div>
              )}
              
              {status === 'completed' && reportData && (
                <div className="flex space-x-3">
                  {reportData.pdfUrl && (
                    <button
                      onClick={() => handleDownload(reportData.pdfUrl!, keyword)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  )}
                  {reportData.driveUrl && (
                    <a
                      href={reportData.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View in Drive</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-300">
              <div>
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">1</span>
                </div>
                <p>Enter a healthcare market keyword or topic</p>
              </div>
              <div>
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">2</span>
                </div>
                <p>AI analyzes market data and generates comprehensive report</p>
              </div>
              <div>
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">3</span>
                </div>
                <p>Download your PDF report with charts and insights</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="healthcare-gradient p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">iHealthcareAnalyst</h3>
            </div>
            <p className="text-slate-400 mb-4">
              "Be part of a culture of data science, extending the impact of your insights."
            </p>
            <p className="text-sm text-slate-500 mb-2">
              Powered by AI • Market Research • Healthcare Analytics
            </p>
            <div className="border-t border-slate-700 pt-4 mt-4">
              <p className="text-sm text-slate-400">
                © 2026 iHealthcareAnalyst, Inc. | All Rights Reserved. | 
                <a 
                  href="https://www.ihealthcareanalyst.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 ml-1"
                >
                  www.ihealthcareanalyst.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
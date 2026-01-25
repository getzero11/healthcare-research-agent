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
import axios from 'axios'

interface ReportStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  keyword: string
  createdAt: string
  pdfUrl?: string
  driveUrl?: string
  error?: string
}

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<ReportStatus[]>([])
  const [currentReport, setCurrentReport] = useState<ReportStatus | null>(null)

  const handleGenerateReport = async () => {
    if (!keyword.trim()) return
    
    setIsGenerating(true)
    try {
      const response = await axios.post('/api/generate-report', {
        keyword: keyword.trim(),
        userEmail: 'anonymous@user.com' // Default email for anonymous users
      })
      
      const newReport: ReportStatus = {
        id: response.data.reportId,
        status: 'processing',
        keyword: keyword.trim(),
        createdAt: new Date().toISOString()
      }
      
      setCurrentReport(newReport)
      setReports(prev => [newReport, ...prev])
      setKeyword('')
      
      // Poll for status updates
      pollReportStatus(newReport.id)
      
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const pollReportStatus = async (reportId: string) => {
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0
    
    const poll = async () => {
      try {
        const response = await axios.get(`/api/report-status/${reportId}`)
        const updatedReport = response.data
        
        setReports(prev => 
          prev.map(report => 
            report.id === reportId ? updatedReport : report
          )
        )
        
        if (currentReport?.id === reportId) {
          setCurrentReport(updatedReport)
        }
        
        if (updatedReport.status === 'completed' || updatedReport.status === 'failed') {
          return
        }
        
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Poll every 5 seconds
        }
      } catch (error) {
        console.error('Error polling report status:', error)
      }
    }
    
    poll()
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

  if (false) { // Remove loading state check
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    )
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
                  placeholder="e.g., Alzheimer's Disease Diagnostics, Robotic Surgery, Digital Therapeutics"
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

        {/* Current Report Status */}
        {currentReport && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Current Report: {currentReport.keyword}
                </h3>
                <div className="flex items-center space-x-2">
                  {currentReport.status === 'processing' && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                      <span className="text-sm text-blue-400">Processing...</span>
                    </>
                  )}
                  {currentReport.status === 'completed' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-green-400">Completed</span>
                    </>
                  )}
                  {currentReport.status === 'failed' && (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <span className="text-sm text-red-400">Failed</span>
                    </>
                  )}
                </div>
              </div>
              
              {currentReport.status === 'processing' && (
                <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full pulse-animation" style={{width: '60%'}}></div>
                </div>
              )}
              
              {currentReport.status === 'completed' && currentReport.pdfUrl && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload(currentReport.pdfUrl!, currentReport.keyword)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                  {currentReport.driveUrl && (
                    <a
                      href={currentReport.driveUrl}
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
              
              {currentReport.status === 'failed' && currentReport.error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                  <p className="text-sm text-red-300">{currentReport.error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Reports */}
        {reports.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Reports</h3>
            <div className="grid gap-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {report.keyword}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {new Date(report.createdAt).toLocaleDateString()} at{' '}
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {report.status === 'processing' && (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                            <span className="text-sm text-blue-400">Processing</span>
                          </>
                        )}
                        {report.status === 'completed' && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-400">Completed</span>
                          </>
                        )}
                        {report.status === 'failed' && (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-red-400">Failed</span>
                          </>
                        )}
                      </div>
                      
                      {report.status === 'completed' && report.pdfUrl && (
                        <button
                          onClick={() => handleDownload(report.pdfUrl!, report.keyword)}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
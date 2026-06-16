"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/app/utils/db'
import { AIOutput } from '@/app/utils/schema'
import { desc } from 'drizzle-orm'
import templates from '@/app/(data)/Template'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Copy, Check, Search, Calendar, FileText, User } from 'lucide-react'

export interface HISTORY_ITEM {
  id: number
  formData: string | null
  aiResponse: string | null
  templateSlug: string
  createdBy: string | null
  createdAt: string | null
}

function History() {
  const [historyList, setHistoryList] = useState<HISTORY_ITEM[]>([])
  const [filteredList, setFilteredList] = useState<HISTORY_ITEM[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    GetHistory()
  }, [])

  const GetHistory = async () => {
    try {
      setLoading(true)
      const result = await db.select().from(AIOutput).orderBy(desc(AIOutput.id))
      // Assert type correctly
      setHistoryList(result as HISTORY_ITEM[])
      setFilteredList(result as HISTORY_ITEM[])
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredList(historyList)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = historyList.filter((item) => {
        const template = templates.find((t) => t.slug === item.templateSlug)
        const templateName = template ? template.name.toLowerCase() : ''
        const responseText = item.aiResponse ? item.aiResponse.toLowerCase() : ''
        const userEmail = item.createdBy ? item.createdBy.toLowerCase() : ''
        const formDataText = item.formData ? item.formData.toLowerCase() : ''

        return (
          templateName.includes(term) ||
          responseText.includes(term) ||
          userEmail.includes(term) ||
          formDataText.includes(term)
        )
      })
      setFilteredList(filtered)
    }
  }, [searchTerm, historyList])

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const GetTemplateDetails = (slug: string) => {
    const template = templates.find((t) => t.slug === slug)
    return {
      name: template ? template.name : 'Unknown Template',
      icon: template ? template.icon : 'https://cdn-icons-png.flaticon.com/128/2799/2799991.png',
    }
  }

  const parseFormData = (formDataStr: string | null) => {
    if (!formDataStr) return 'No Input'
    try {
      const parsed = JSON.parse(formDataStr)
      return Object.entries(parsed)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ')
    } catch (e) {
      return formDataStr
    }
  }

  const getWordCount = (text: string | null) => {
    if (!text) return 0
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          History
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Search and view all previously generated AI content. Copy responses directly to your clipboard.
        </p>
      </div>

      {/* Control Bar: Search and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by template, user, prompt or result..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-lg border">
          <div>
            Total Searches: <span className="text-primary font-bold text-sm ml-1">{historyList.length}</span>
          </div>
          <div className="border-l pl-4">
            Matching: <span className="text-emerald-600 font-bold text-sm ml-1">{filteredList.length}</span>
          </div>
        </div>
      </div>

      {/* History List/Table Container */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-500 font-medium">Fetching history from database...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No history entries found</h3>
            <p className="text-sm text-gray-500 px-4">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create some content to view your history.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Template</th>
                  <th className="py-4 px-6 hidden md:table-cell">User</th>
                  <th className="py-4 px-6 hidden lg:table-cell">Inputs</th>
                  <th className="py-4 px-6 w-96">AI Response</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Words</th>
                  <th className="py-4 px-6 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {filteredList.map((item) => {
                  const templateDetails = GetTemplateDetails(item.templateSlug)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      {/* Template */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded-lg shrink-0">
                            <Image
                              src={templateDetails.icon}
                              alt={templateDetails.name}
                              width={24}
                              height={24}
                              unoptimized
                            />
                          </div>
                          <span className="font-semibold text-gray-900 block truncate max-w-[150px]">
                            {templateDetails.name}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex items-center gap-2 max-w-[150px] truncate">
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="text-gray-600 truncate text-xs" title={item.createdBy || 'Unknown'}>
                            {item.createdBy || 'Unknown'}
                          </span>
                        </div>
                      </td>

                      {/* Inputs */}
                      <td className="py-4 px-6 hidden lg:table-cell">
                        <p
                          className="text-xs text-gray-500 truncate max-w-[200px]"
                          title={parseFormData(item.formData)}
                        >
                          {parseFormData(item.formData)}
                        </p>
                      </td>

                      {/* AI Response */}
                      <td className="py-4 px-6">
                        <p
                          className="line-clamp-2 text-xs leading-relaxed text-gray-600"
                          title={item.aiResponse || ''}
                        >
                          {item.aiResponse}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.createdAt || 'N/A'}
                        </div>
                      </td>

                      {/* Words */}
                      <td className="py-4 px-6 text-center font-mono text-xs text-gray-500 font-medium">
                        {getWordCount(item.aiResponse)}
                      </td>

                      {/* Copy Action */}
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/5 text-primary hover:text-primary p-2 h-8 w-8"
                          onClick={() => handleCopy(item.aiResponse || '', item.id)}
                          disabled={!item.aiResponse}
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default History

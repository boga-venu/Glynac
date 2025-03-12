// src/components/dashboard/file-activity.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface FileData {
  id: string
  name: string
  type: string
  creator: string
  lastModified: string
  views: number
}

interface FileActivityProps {
  files: FileData[]
}

export function FileActivity({ files }: FileActivityProps) {
  const [activeTab, setActiveTab] = useState('inactive')
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'docx':
        return '📄'
      case 'xlsx':
        return '📊'
      case 'pptx':
        return '📊'
      case 'pdf':
        return '📄'
      default:
        return '📝'
    }
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Document & File Activity</CardTitle>
        <Button variant="ghost" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inactive" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inactive">Inactive Files</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="access">Access Patterns</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
          {files.map((file) => (
            <div key={file.id} className="flex items-center border-b border-gray-100 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-gray-100 mr-3">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-gray-500">Created by {file.creator} • Last modified {file.lastModified}</div>
              </div>
              <div className="text-sm text-gray-600">
                {file.views} {file.views === 1 ? 'view' : 'views'} in last 30 days
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
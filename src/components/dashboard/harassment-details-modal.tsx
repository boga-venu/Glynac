// src/components/dashboard/harassment-details-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isFlagged: boolean
}

interface HarassmentDetail {
  id: string
  participants: string[]
  messages: Message[]
  severity: 'high' | 'medium' | 'low'
  timestamp: string
}

interface HarassmentDetailsModalProps {
  alertId: string | null
  isOpen: boolean
  onClose: () => void
  fetchHarassmentDetails: (id: string) => Promise<HarassmentDetail>
}

export function HarassmentDetailsModal({
  alertId,
  isOpen,
  onClose,
  fetchHarassmentDetails,
}: HarassmentDetailsModalProps) {
  const [alert, setAlert] = useState<HarassmentDetail | null>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (isOpen && alertId) {
      setLoading(true)
      fetchHarassmentDetails(alertId)
        .then(data => {
          setAlert(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching harassment details:', error)
          setLoading(false)
        })
    } else {
      setAlert(null)
    }
  }, [isOpen, alertId, fetchHarassmentDetails])
  
  if (!isOpen) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] p-0 gap-0 overflow-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Harassment Alert Details
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading alert details...</div>
        ) : alert ? (
          <div className="p-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-2">Participants</h3>
                <p>Employee IDs: {alert.participants.join(', ')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Messages</h3>
                <div className="space-y-3 mb-4">
                  {alert.messages.map(message => (
                    <div 
                      key={message.id}
                      className={message.isFlagged 
                        ? "bg-red-50 p-3 rounded" 
                        : "text-gray-600 p-3"
                      }
                    >
                      <p>
                        <span className="font-medium">{message.sender}:</span> {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Severity</h3>
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Risk
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Timestamp</h3>
                <p>{alert.timestamp}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p>Could not load alert details. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
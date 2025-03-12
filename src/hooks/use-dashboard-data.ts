// src/hooks/use-dashboard-data.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// Dashboard overview data
export function useGlynacScore() {
  return useQuery({
    queryKey: ['glynac-score'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/glynac-score')
      return data
    }
  })
}

export function useRiskAlerts() {
  return useQuery({
    queryKey: ['risk-alerts'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/risk-alerts')
      return data
    }
  })
}

export function useSentimentAnalysis() {
  return useQuery({
    queryKey: ['sentiment-analysis'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/sentiment-analysis')
      return data
    }
  })
}

export function useWorkloadAnalysis() {
  return useQuery({
    queryKey: ['workload-analysis'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/workload-analysis')
      return data
    }
  })
}

export function useFileActivity() {
  return useQuery({
    queryKey: ['file-activity'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/file-activity')
      return data
    }
  })
}

export function useEmployeeInsights() {
  return useQuery({
    queryKey: ['employee-insights'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/employee-insights')
      return data
    }
  })
}

// Detail data
export function useEmployeeDetails(id: string | null) {
  return useQuery({
    queryKey: ['employee-details', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await axios.get(`/api/employees/${id}`)
      return data
    },
    enabled: !!id
  })
}

export function useHarassmentDetails(id: string | null) {
  return useQuery({
    queryKey: ['harassment-details', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await axios.get(`/api/alerts/${id}`)
      return data
    },
    enabled: !!id
  })
}

// Fetch functions for modals
export const fetchEmployeeDetails = async (id: string) => {
  const { data } = await axios.get(`/api/employees/${id}`)
  return data
}

export const fetchHarassmentDetails = async (id: string) => {
  const { data } = await axios.get(`/api/alerts/${id}`)
  return data
}
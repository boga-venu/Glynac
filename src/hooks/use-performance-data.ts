// src/hooks/use-performance-data.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface PerformanceDrag {
  employee: string
  negativity: number
  responseTime: number
  size: number
}

export interface EfficiencyScore {
  taskCompletionRate: number
  avgResponseTime: number
  meetingOverload: number
}

export interface UntappedTalent {
  employee: string
  skillScore: number
  complaints: number
}

export interface ResponseTime {
  employee: string
  avgResponse: number
  benchmark: number
}

export interface NegativeCommunication {
  employee: string
  negativePercentage: number
}

export interface OverdueTasks {
  employee: string
  count: number
}

export interface RepeatedTopic {
  topic: string
  count: number
}

// Fetch performance drags
export function usePerformanceDrags() {
  return useQuery({
    queryKey: ['performance-drags'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/performance/drags');
        return data as PerformanceDrag[];
      } catch (error) {
        console.error('Error fetching performance drags:', error);
        
        // Fallback mock data
        return [
          { employee: 'Employee A', negativity: 75, responseTime: 5.2, size: 100 },
          { employee: 'Employee B', negativity: 45, responseTime: 2.1, size: 100 },
          { employee: 'Employee C', negativity: 20, responseTime: 6.8, size: 100 },
          { employee: 'Employee D', negativity: 60, responseTime: 4.3, size: 100 },
          { employee: 'Employee E', negativity: 30, responseTime: 3.5, size: 100 },
        ] as PerformanceDrag[];
      }
    }
  })
}

// Fetch efficiency score
export function useEfficiencyScore() {
  return useQuery({
    queryKey: ['efficiency-score'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/performance/efficiency');
        return data as EfficiencyScore;
      } catch (error) {
        console.error('Error fetching efficiency scores:', error);
        
        // Fallback mock data
        return {
          taskCompletionRate: 75,
          avgResponseTime: 4,
          meetingOverload: 5,
        } as EfficiencyScore;
      }
    }
  })
}

// Fetch untapped talent
export function useUntappedTalent() {
  return useQuery({
    queryKey: ['untapped-talent'],
    queryFn: async () => {
      // This endpoint still needs to be implemented
      // When you implement it, replace this with an actual API call
      
      try {
        // const { data } = await axios.get('/api/performance/untapped-talent');
        // return data as UntappedTalent[];
        
        // For now, return mock data
        return [
          { employee: 'Employee D', skillScore: 85, complaints: 1 },
          { employee: 'Employee E', skillScore: 82, complaints: 0 },
        ] as UntappedTalent[];
      } catch (error) {
        console.error('Error fetching untapped talent:', error);
        return [] as UntappedTalent[];
      }
    }
  })
}

// Fetch response times
export function useResponseTimes() {
  return useQuery({
    queryKey: ['response-times'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/performance/response-times');
        return data as ResponseTime[];
      } catch (error) {
        console.error('Error fetching response times:', error);
        
        // Fallback mock data
        return [
          { employee: 'Sarah Johnson', avgResponse: 4.2, benchmark: 2.5 },
          { employee: 'Michael Chen', avgResponse: 2.1, benchmark: 2.5 },
          { employee: 'Emily Rodriguez', avgResponse: 1.5, benchmark: 2.5 },
          { employee: 'David Kim', avgResponse: 3.0, benchmark: 2.5 },
          { employee: 'Alex Thompson', avgResponse: 4.8, benchmark: 2.5 },
        ] as ResponseTime[];
      }
    }
  })
}

// Fetch negative communication
export function useNegativeCommunication() {
  return useQuery({
    queryKey: ['negative-communication'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/performance/negative-communication');
        return data as NegativeCommunication[];
      } catch (error) {
        console.error('Error fetching negative communication data:', error);
        
        // Fallback mock data
        return [
          { employee: 'Sarah Johnson', negativePercentage: 15 },
          { employee: 'Michael Chen', negativePercentage: 5 },
          { employee: 'Emily Rodriguez', negativePercentage: 3 },
          { employee: 'David Kim', negativePercentage: 7 },
          { employee: 'Alex Thompson', negativePercentage: 22 },
        ] as NegativeCommunication[];
      }
    }
  })
}

// Fetch overdue tasks
export function useOverdueTasks() {
  return useQuery({
    queryKey: ['overdue-tasks'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/performance/overdue-tasks');
        return data as OverdueTasks[];
      } catch (error) {
        console.error('Error fetching overdue tasks:', error);
        
        // Fallback mock data
        return [
          { employee: 'Sarah Johnson', count: 3 },
          { employee: 'Michael Chen', count: 1 },
          { employee: 'Emily Rodriguez', count: 0 },
          { employee: 'David Kim', count: 1 },
          { employee: 'Alex Thompson', count: 4 },
        ] as OverdueTasks[];
      }
    }
  })
}

// Fetch repeated topics
export function useRepeatedTopics() {
  return useQuery({
    queryKey: ['repeated-topics'],
    queryFn: async () => {
      // This endpoint still needs to be implemented
      // When you implement it, replace this with an actual API call
      
      try {
        // const { data } = await axios.get('/api/performance/repeated-topics');
        // return data as RepeatedTopic[];
        
        // For now, return mock data
        return [
          { topic: 'Project timeline concerns', count: 12 },
          { topic: 'Budget constraints', count: 8 },
          { topic: 'Resource allocation', count: 7 },
          { topic: 'Design feedback', count: 5 },
        ] as RepeatedTopic[];
      } catch (error) {
        console.error('Error fetching repeated topics:', error);
        return [] as RepeatedTopic[];
      }
    }
  })
}
// src/hooks/use-retention-data.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface FlightRiskEmployee {
  id: string
  name: string
  risk: number
  department: string
  tenure: string
  factors: string[]
}

export interface ComplaintTrend {
  period: string
  count: number
}

export interface CommunicationVolume {
  month: string
  volume: number
}

export interface SentimentData {
  name: string
  value: number
}

export interface MeetingLoad {
  employee: string
  meetings: number
  focusTime: number
}

// Fetch retention rate
export function useRetentionRate() {
  return useQuery({
    queryKey: ['retention-rate'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/retention/rate');
        return data;
      } catch (error) {
        console.error('Error fetching retention rate:', error);
        
        // Fallback mock data
        return {
          rate: 85,
          industryAverage: 82,
          trend: 2.5,
        };
      }
    }
  })
}

// Fetch flight risk employees
export function useFlightRiskEmployees() {
  return useQuery({
    queryKey: ['flight-risk-employees'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/retention/flight-risk');
        return data as FlightRiskEmployee[];
      } catch (error) {
        console.error('Error fetching flight risk employees:', error);
        
        // Fallback mock data
        return [] as FlightRiskEmployee[];
      }
    }
  })
}

// Fetch complaint trends
export function useComplaintTrends() {
  return useQuery({
    queryKey: ['complaint-trends'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/risks/complaints');
        return data as ComplaintTrend[];
      } catch (error) {
        console.error('Error fetching complaint trends:', error);
        
        // Fallback mock data
        return [
          { period: 'Week 1', count: 3 },
          { period: 'Week 2', count: 4 },
          { period: 'Week 3', count: 6 },
          { period: 'Week 4', count: 5 },
          { period: 'Week 5', count: 7 },
        ] as ComplaintTrend[];
      }
    }
  })
}

// Fetch communication volume
export function useCommunicationVolume() {
  return useQuery({
    queryKey: ['communication-volume'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/retention/communication');
        return data;
      } catch (error) {
        console.error('Error fetching communication volume:', error);
        
        // Fallback mock data
        return {
          total: 150,
          engagementRate: 75,
          trend: -12,
          volumeByMonth: [
            { month: 'Jan', volume: 245 },
            { month: 'Feb', volume: 255 },
            { month: 'Mar', volume: 230 },
            { month: 'Apr', volume: 210 },
            { month: 'May', volume: 185 },
            { month: 'Jun', volume: 170 },
          ]
        };
      }
    }
  })
}

// Fetch sentiment analysis
export function useSentimentAnalysis() {
  return useQuery({
    queryKey: ['sentiment-analysis-retention'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/retention/sentiment');
        return data;
      } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
        
        // Fallback mock data
        return {
          distribution: [
            { name: 'Positive', value: 55 },
            { name: 'Neutral', value: 30 },
            { name: 'Negative', value: 15 },
          ],
          trend: 5
        };
      }
    }
  })
}

// Fetch meeting load
export function useMeetingLoad() {
  return useQuery({
    queryKey: ['meeting-load'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/retention/meetings');
        return data;
      } catch (error) {
        console.error('Error fetching meeting load:', error);
        
        // Fallback mock data
        return {
          averageMeetings: 23,
          averageFocusTime: 15,
          optimalBalance: 68,
          employeeData: [
            { employee: 'Sarah Johnson', meetings: 35, focusTime: 8 },
            { employee: 'Michael Chen', meetings: 22, focusTime: 15 },
            { employee: 'Emily Rodriguez', meetings: 18, focusTime: 20 },
            { employee: 'David Kim', meetings: 12, focusTime: 25 },
            { employee: 'Alex Thompson', meetings: 28, focusTime: 10 },
          ]
        };
      }
    }
  })
}
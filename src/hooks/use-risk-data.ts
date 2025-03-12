// src/hooks/use-risk-data.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface SecurityRisk {
  id: string
  employeeId: string
  employeeName: string
  riskLevel: 'high' | 'medium' | 'low'
  riskScore: number
  activityDescription: string
  timestamp: string
}

export interface HarassmentMessage {
  id: string
  sender: string
  content: string
  timestamp: string
  severity: 'high' | 'medium' | 'low'
}

export interface ComplaintTrend {
  period: string
  count: number
}

export interface UnwantedBehavior {
  type: string
  count: number
  examples: string[]
}

// Fetch security risks
export function useSecurityRisks() {
  return useQuery({
    queryKey: ['security-risks'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/risks/security');
        return data as SecurityRisk[];
      } catch (error) {
        console.error('Error fetching security risks:', error);
        return [] as SecurityRisk[];
      }
    }
  })
}

// Fetch harassment messages
export function useHarassmentMessages() {
  return useQuery({
    queryKey: ['harassment-messages'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/risks/harassment');
        return data as HarassmentMessage[];
      } catch (error) {
        console.error('Error fetching harassment messages:', error);
        return [] as HarassmentMessage[];
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
        
        // Fallback mock data if API fails
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

// Fetch unwanted behaviors
export function useUnwantedBehaviors() {
  return useQuery({
    queryKey: ['unwanted-behaviors'],
    queryFn: async () => {
      // This one doesn't have a corresponding API endpoint yet,
      // will need to be implemented based on your schema
      try {
        // When you implement this endpoint, uncomment below
        // const { data } = await axios.get('/api/risks/unwanted-behaviors');
        // return data;
        
        // For now, return mock data
        return [
          { 
            type: 'Missed Meetings', 
            count: 5,
            examples: ['Team standup on Monday', 'Client pitch on Wednesday']
          },
          { 
            type: 'Lies to Clients', 
            count: 3,
            examples: ['Promised delivery date that was impossible', 'Misrepresented product features']
          },
          { 
            type: 'Failure to Show Up', 
            count: 2,
            examples: ['Interview no-show', 'Skipped mandatory training']
          },
          { 
            type: 'Moved Meetings', 
            count: 7,
            examples: ['Last-minute reschedule of executive review', 'Repeatedly moved 1:1 with direct reports']
          },
        ] as UnwantedBehavior[];
      } catch (error) {
        console.error('Error fetching unwanted behaviors:', error);
        return [] as UnwantedBehavior[];
      }
    }
  })
}

// Fetch risk distribution
export function useRiskDistribution() {
  return useQuery({
    queryKey: ['risk-distribution'],
    queryFn: async () => {
      try {
        // This endpoint still needs to be implemented
        // const { data } = await axios.get('/api/risks/distribution');
        // return data;
        
        // For now, return mock data
        return [
          { name: 'Harassment', value: 25 },
          { name: 'Security', value: 35 },
          { name: 'Burnout', value: 20 },
          { name: 'Complaints', value: 15 },
          { name: 'Calendar', value: 5 },
        ];
      } catch (error) {
        console.error('Error fetching risk distribution:', error);
        return [];
      }
    }
  })
}
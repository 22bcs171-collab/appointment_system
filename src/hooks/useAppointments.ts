import { useState, useEffect, useCallback } from 'react'
import { Appointment, TimeSlot } from '@/types/appointment'
import { generateTimeSlots } from '@/lib/utils'

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load appointments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('appointments')
      if (stored) {
        const parsed = JSON.parse(stored)
        setAppointments(parsed.map((apt: any) => ({
          ...apt,
          date: new Date(apt.date),
          createdAt: new Date(apt.createdAt),
          updatedAt: new Date(apt.updatedAt)
        })))
      }
    } catch (error) {
      console.error('Failed to load appointments:', error)
      setError('Failed to load appointments')
    }
  }, [])

  // Save appointments to localStorage
  const saveAppointments = useCallback((newAppointments: Appointment[]) => {
    try {
      localStorage.setItem('appointments', JSON.stringify(newAppointments))
      setAppointments(newAppointments)
    } catch (error) {
      console.error('Failed to save appointments:', error)
      setError('Failed to save appointment')
    }
  }, [])

  const bookAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const updatedAppointments = [...appointments, newAppointment]
      saveAppointments(updatedAppointments)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return newAppointment
    } catch (error) {
      setError('Failed to book appointment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [appointments, saveAppointments])

  const cancelAppointment = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedAppointments = appointments.map(apt => 
        apt.id === id 
          ? { ...apt, status: 'cancelled' as const, updatedAt: new Date() }
          : apt
      )
      saveAppointments(updatedAppointments)
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      setError('Failed to cancel appointment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [appointments, saveAppointments])

  const rescheduleAppointment = useCallback(async (id: string, newDate: Date, newTime: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedAppointments = appointments.map(apt => 
        apt.id === id 
          ? { ...apt, date: newDate, time: newTime, updatedAt: new Date() }
          : apt
      )
      saveAppointments(updatedAppointments)
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      setError('Failed to reschedule appointment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [appointments, saveAppointments])

  const getAvailableTimeSlots = useCallback((date: Date): TimeSlot[] => {
    const baseSlots = generateTimeSlots()
    const dateAppointments = appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString() && 
      apt.status !== 'cancelled'
    )
    
    return baseSlots.map(slot => ({
      ...slot,
      available: slot.available && !dateAppointments.some(apt => apt.time === slot.time)
    }))
  }, [appointments])

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAvailableTimeSlots
  }
}
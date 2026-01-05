export interface Appointment {
  id: string
  date: Date
  time: string
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  notes?: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  time: string
  available: boolean
  appointmentId?: string
}

export interface Service {
  id: string
  name: string
  duration: number // in minutes
  price: number
  description: string
}

export interface BookingForm {
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  notes: string
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  reminderTime: number // hours before appointment
}
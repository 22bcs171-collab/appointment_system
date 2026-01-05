import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CalendarIcon, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { formatDate, formatTime, cn } from '@/lib/utils'
import { useAppointments } from '@/hooks/useAppointments'
import { BookingForm } from '@/types/appointment'

export function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: 'General Consultation',
    notes: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const { getAvailableTimeSlots, bookAppointment, loading } = useAppointments()

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined)
    setShowBookingForm(false)
    setShowConfirmation(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowBookingForm(true)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    try {
      await bookAppointment({
        date: selectedDate,
        time: selectedTime,
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        clientPhone: bookingForm.clientPhone,
        service: bookingForm.service,
        notes: bookingForm.notes,
        status: 'confirmed'
      })
      
      setShowConfirmation(true)
      setShowBookingForm(false)
      
      // Reset form
      setBookingForm({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        service: 'General Consultation',
        notes: ''
      })
    } catch (error) {
      console.error('Failed to book appointment:', error)
    }
  }

  const availableSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : []
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Book Your Appointment</h1>
        <p className="text-lg text-gray-600">Select a date and time that works best for you</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule Appointment
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Calendar Section */}
            <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < tomorrow}
                className="w-full flex justify-center"
              />
            </div>

            {/* Time Slots Section */}
            <div className="w-full lg:w-80 p-6">
              {selectedDate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    Available times for {formatDate(selectedDate)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={cn(
                          "w-full justify-center",
                          !slot.available && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {formatTime(slot.time)}
                      </Button>
                    ))}
                  </div>
                  
                  {availableSlots.every(slot => !slot.available) && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No available slots for this date
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mb-2 opacity-50" />
                  <p>Select a date to view available times</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      {showBookingForm && selectedDate && selectedTime && (
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleBookingSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <Input
                    required
                    placeholder="Enter your full name"
                    value={bookingForm.clientName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, clientName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <Input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={bookingForm.clientEmail}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <Input
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={bookingForm.clientPhone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Type</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, service: e.target.value }))}
                  >
                    <option value="General Consultation">General Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Assessment">Initial Assessment</option>
                    <option value="Specialist Consultation">Specialist Consultation</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Any specific requirements or notes..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">Appointment Summary:</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {formatDate(selectedDate)} at {formatTime(selectedTime)}
                </p>
                <p className="text-sm text-blue-600">Service: {bookingForm.service}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Confirmation */}
      {showConfirmation && selectedDate && selectedTime && (
        <Card className="animate-fade-in bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800">Appointment Confirmed!</h3>
              <p className="text-green-700">
                Your appointment has been successfully booked for {formatDate(selectedDate)} at {formatTime(selectedTime)}.
              </p>
              <p className="text-sm text-green-600">
                A confirmation email has been sent to your email address with all the details.
              </p>
              <Button
                onClick={() => {
                  setSelectedDate(undefined)
                  setSelectedTime(undefined)
                  setShowConfirmation(false)
                }}
                className="mt-4"
              >
                Book Another Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'
import { AppointmentBooking } from '@/components/AppointmentBooking'
import { AppointmentList } from '@/components/AppointmentList'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { Calendar, List, Clock, Bell } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('book')

  // Mandatory iframe logging setup
  useEffect(() => {
    ["log", "warn", "error"].forEach((level) => {
      const original = console[level as keyof Console] as (...args: any[]) => void;

      console[level as keyof Console] = (...args: any[]) => {
        // keep normal console output
        original.apply(console, args);

        // sanitize args for postMessage
        const safeArgs = args.map((a) => {
          if (a instanceof Error) {
            return {
              message: a.message,
              stack: a.stack,
              name: a.name,
            };
          }
          try {
            JSON.stringify(a);
            return a;
          } catch {
            return String(a);
          }
        });

        try {
          window.parent?.postMessage(
            { type: "iframe-console", level, args: safeArgs },
            "*"
          );
        } catch (e) {
          // use original, not the wrapped one (avoid recursion)
          original("Failed to postMessage:", e);
        }
      };
    });

    // Global error handler
    window.onerror = (msg, url, line, col, error) => {
      window.parent?.postMessage(
        {
          type: "iframe-console",
          level: "error",
          args: [
            msg,
            url,
            line,
            col,
            error ? { message: error.message, stack: error.stack } : null,
          ],
        },
        "*"
      );
    };

    // Unhandled promise rejections
    window.onunhandledrejection = (event) => {
      const reason =
        event.reason instanceof Error
          ? { message: event.reason.message, stack: event.reason.stack }
          : event.reason;

      window.parent?.postMessage(
        {
          type: "iframe-console",
          level: "error",
          args: ["Unhandled Promise Rejection:", reason],
        },
        "*"
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Appointment Booking Agent
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={activeTab === 'book' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('book')}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </Button>
                <Button
                  variant={activeTab === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('list')}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  My Appointments
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'book' && <AppointmentBooking />}
          {activeTab === 'list' && <AppointmentList />}
        </main>

        {/* Features Banner */}
        <div className="bg-blue-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900 mb-2">Real-time Availability</h3>
                <p className="text-sm text-blue-700">
                  View available time slots in real-time and book instantly
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900 mb-2">Automated Reminders</h3>
                <p className="text-sm text-green-700">
                  Receive email confirmations and automatic reminders
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <List className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-purple-900 mb-2">Easy Management</h3>
                <p className="text-sm text-purple-700">
                  Reschedule or cancel appointments with just a few clicks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
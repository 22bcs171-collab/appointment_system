# Appointment Booking Agent

A comprehensive appointment booking system built with React and TypeScript that streamlines scheduling processes for service providers while delivering a seamless booking experience for clients.

## Features

- 📅 **Intuitive Scheduling**: Easy-to-use calendar interface for both providers and clients
- 🔄 **Real-time Updates**: Live availability display and instant booking confirmations
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- 📝 **Appointment Management**: Complete CRUD operations for appointments
- 🔔 **Status Tracking**: Visual status indicators for all appointments
- ⚡ **Fast Performance**: Built with Vite for optimal development and build speed

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Day Picker** - Calendar component
- **Date-fns** - Date utility library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── AppointmentBooking.tsx
│   ├── AppointmentList.tsx
│   └── ErrorBoundary.tsx
├── hooks/
│   └── useAppointments.ts
├── lib/
│   └── utils.ts      # Utility functions
├── types/
│   └── appointment.ts # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css
```

## Usage

### Booking an Appointment

1. Select a date from the calendar
2. Choose an available time slot
3. Fill in your contact information
4. Add any special notes or requirements
5. Click "Book Appointment" to confirm

### Managing Appointments

- View all appointments in the "My Appointments" section
- Cancel appointments with a single click
- Edit appointment details as needed
- Track appointment status with visual indicators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
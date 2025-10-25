# Virtual Natural Events Timeline

A React + Vite project that visualizes earthquake and natural disaster data from the USGS API using a custom virtualized scrolling system.

![Natural Events Timeline Demo](https://img.shields.io/badge/status-live-brightgreen)
![React](https://img.shields.io/badge/React-19.1%2B-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9%2B-blue)
![Vite](https://img.shields.io/badge/Vite-7.1%2B-purple)

## Features

### Performance Optimizations
- **Custom Virtualization**: Only renders visible timeline items for optimal performance
- **Infinite Scroll**: Dynamically loads more earthquake data as you scroll
- **Memory Efficient**: Handles thousands of events without performance degradation
- **Smooth Scrolling**: 60fps scroll performance with virtualized rendering

### Real-time Data
- **USGS Integration**: Live earthquake data from the USGS Earthquake Hazards Program
- **Smart Filtering**: Filter by magnitude (2.5+ to 6.0+)
- **Time-based Loading**: Loads events from recent weeks with automatic pagination
- **Comprehensive Details**: Magnitude, location, depth, coordinates, and timing

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Intuitive Interface**: Clean, accessible timeline with visual magnitude indicators
- **Interactive Elements**: Click events to view detailed USGS reports
- **Real-time Updates**: Live loading states and error handling

## Tech Stack

- **Framework**: React 19.1+ with TypeScript
- **Build Tool**: Vite 7.1+
- **API**: USGS Earthquake Hazards Program API
- **Performance**: Custom virtualization hooks
- **State Management**: React hooks with optimized re-renders

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mocaBit/virtualization.git
cd virtualization

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Architecture

### Project Structure
```
src/
├── components/
│   ├── VirtualTimeline.tsx      # Main virtualized timeline component
│   ├── TimelineItem.tsx         # Individual earthquake event item
│   └── Loader.tsx               # Loading indicator component
├── hooks/
│   └── useVirtualScroll.ts      # Custom virtualization hook
├── services/
│   └── earthquakeAPI.ts         # USGS API integration
├── types/
│   └── earthquake.ts            # TypeScript interfaces
├── utils/
│   └── formatters.ts           # Date and data formatting utilities
├── App.tsx                      # Main application component
└── main.tsx                     # Application entry point
```

### Key Components

#### Virtual Scrolling Engine
The `useVirtualScroll` hook implements a custom virtualization system:
- Calculates visible items based on scroll position
- Maintains a buffer (overscan) for smooth scrolling
- Optimizes DOM updates to only render what's visible

#### API Integration
Smart data fetching from USGS:
- Initial load: Last 30 days of events
- Infinite scroll: Extends time range automatically
- Error handling and retry mechanisms
- Magnitude-based filtering

#### Performance Features
- **Memoization**: Prevents unnecessary re-renders
- **Passive Event Listeners**: Smooth scroll performance
- **Efficient Updates**: Only updates visible components
- **Memory Management**: Cleans up event listeners properly

## Usage

### Filtering Events
- Use magnitude filter buttons (2.5+ to 6.0+) to focus on significant events
- Timeline automatically updates with new filter criteria

### Exploring Data
- Scroll through thousands of earthquake events
- Click any event to view detailed USGS report
- Visual magnitude indicators show event severity
- Relative time stamps for recent events

### Performance Testing
- Load thousands of events without lag
- Smooth 60fps scrolling even with large datasets
- Memory usage remains constant regardless of data size

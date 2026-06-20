# AquaSavvy Website

A smart water management platform that helps users monitor, manage, and optimize their water consumption with AI-powered insights and verified professional support.

## Features

- **Smart Monitoring**: Real-time water usage tracking with AI-powered insights and predictive analytics.
- **Leak Detection**: Instant alerts for anomalies, leaks, and unusual consumption patterns.
- **Usage Analytics**: Detailed consumption reports with trends, forecasts, and cost optimization.
- **Verified Plumbers**: Access certified professionals with verified credentials and transparent pricing.
- **Gamified Water-Saving Rewards**: Earn rewards for saving water with challenges and leaderboards.
- **Marketplace**: Shop premium water-saving products including smart meters, filters, and eco-friendly solutions.
- **Admin Portal**: SuperAdmin portal for managing challenges, plumbers, water metrics, and marketplace items.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Express.js
- **Database**: Firebase (Firestore)
- **Build Tool**: Esbuild

## Project Structure

```
AquaSavvy Website/
├── admin/                   # Admin portal components
├── functions/               # Firebase Cloud Functions
├── public/                  # Static assets (images, videos)
├── scripts/                 # Utility scripts
├── services/                # Service layer (challenges, payments, reviews, water metrics)
├── types/                   # TypeScript type definitions
├── AppStorePage.tsx         # App Store page component
├── PlumberVerificationForm.tsx  # Plumber verification form
├── SuperAdminPortal.tsx     # SuperAdmin portal
├── admin-login.tsx          # Admin login page
├── client.tsx               # Client entry point
├── firebase.ts              # Firebase configuration
├── index.html               # HTML entry point
├── index.tsx                # Main website component
├── market.tsx               # Marketplace page
├── package.json             # Dependencies and scripts
└── server.js                # Express server
```

## Getting Started

### Prerequisites

- Node.js 20
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dikitosimbarashe/AquaSavvy_website.git
   cd AquaSavvy_website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

- **Development**:
  ```bash
  npm run dev
  ```

- **Production**:
  ```bash
  npm start
  ```

## License

ISC

## Author

dikitosimbarashe

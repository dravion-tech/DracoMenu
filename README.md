# Digital Menu SaaS - MVP

A full-stack SaaS platform for restaurants to create QR-based digital menus and manage orders.

## Features

- **Restaurant Dashboard**: Manage categories and menu items.
- **Branding**: Customize themes (Modern, Dark, Minimal) and primary colors.
- **QR Code System**: Generate and download menu QRs.
- **Digital Menu**: Customer scan-to-order interface.
- **Order Management**: Real-time order tracking with status updates.

## Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Vanilla CSS.
- **Backend**: Node.js, Express, MongoDB, JWT, QRCode.

## Setup Instructions

### Backend

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `server/`: Express backend with Mongoose models and controllers.
- `client/`: React frontend with context-based state management.

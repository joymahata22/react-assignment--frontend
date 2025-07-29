# Session Management System

A full-stack web application for managing and sharing sessions with authentication and real-time updates.

## Features

### Authentication
- User registration and login
- Secure token-based authentication
- Protected routes
- Automatic logout functionality

### Session Management
- Create new sessions
- Edit existing sessions
- Delete sessions
- Publish/unpublish sessions
- Auto-save draft functionality
- Tag-based organization

### Dashboard
- View all published sessions
- Responsive grid layout
- User-friendly interface
- Smooth animations using Framer Motion

### User Features
- Personal session management
- View session history
- Real-time status updates
- Secure session editing

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Framer Motion for animations
- Tailwind CSS for styling
- Zod for form validation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
backend/
  ├── controller/
  │   ├── authController.js
  │   └── sessionController.js
  ├── middleware/
  │   └── auth.js
  ├── models/
  │   ├── Session.js
  │   └── User.js
  ├── routes/
  │   ├── authRoutes.js
  │   └── sessionRoutes.js
  ├── utils/
  │   └── db.js
  └── index.js

frontend/
  ├── src/
  │   ├── components/
  │   │   ├── auth/
  │   │   ├── pages/
  │   │   └── ui/
  │   ├── App.jsx
  │   └── main.jsx
  ├── public/
  └── index.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Sessions
- `GET /api/sessions` - Get all published sessions
- `GET /api/my-sessions` - Get user's sessions
- `GET /api/my-sessions/:id` - Get single session
- `POST /api/my-sessions/save-draft` - Save session draft
- `POST /api/my-sessions/publish` - Publish session
- `DELETE /api/my-sessions/:id` - Delete session

## Features in Detail

### Auto-save
- Automatically saves drafts every 5 seconds
- Visual feedback for save status
- Prevents data loss

### Responsive Design
- Mobile-first approach
- Fluid layouts
- Adaptive components

### Error Handling
- Comprehensive error messages
- User-friendly error displays
- Secure error logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

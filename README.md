# Vacation Management System

## Overview
A web system developed in Next.js for managing employee vacation requests. The system has different access levels (administrator and employee) and allows complete control of the vacation request flow.

## Technologies Used

- **Frontend**:
  - Next.js 15.2.3
  - React 19.0.0
  - TypeScript
  - Tailwind CSS
  - Axios
  - React Hook Form

- **Main Features**:
  - User authentication
  - Vacation request management
  - Administrative panel
  - Employee dashboard

## Project Structure

```
frontend-ferias/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── ferias/
│   │   │   └── nova/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FeriasForm.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Navbar.tsx
│   │   ├── RegisterForm.tsx
│   │   └── UserManagement.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── services/
│       ├── api.ts
│       ├── authService.ts
│       └── feriasService.ts
```

## System Flows

### 1. Authentication

#### Login
- User accesses the login page
- Enters credentials (email and password)
- System validates the credentials
- Redirects to:
  - `/admin` if administrator
  - `/dashboard` if regular employee

#### Registration
- User accesses the registration page
- Fills in personal data (name, email, position, password)
- System validates and creates a new account
- Redirects to dashboard

### 2. Employee Flow

#### Dashboard
- Views their vacation requests
- Possible statuses: pending, approved, rejected
- Can create new requests
- Can delete pending requests

#### New Request
- Accesses the new request form
- Fills in:
  - Start date
  - End date
  - Reason
- System registers the request with status "pending"

### 3. Administrator Flow

#### Administrative Panel
- Lists all vacation requests
- Can approve or reject requests
- Views complete employee information
- Manages system users

## Services

### authService
- `loginWithCredentials`: User authentication
- `register`: Register new users
- `isAuthenticated`: Checks authentication status
- `isAdmin`: Checks if user is an administrator
- `logout`: Ends user session

### feriasService
- `create`: Creates a new request
- `list`: Lists user requests
- `listAll`: Lists all requests (admin)
- `updateStatus`: Updates request status
- `delete`: Removes pending request

## Contexts

### AuthContext
- Manages global authentication state
- Maintains logged-in user information
- Provides authentication methods for components

## Main Components

### LoginForm
- Authentication form
- Field validation
- Error handling
- Redirection based on user type

### RegisterForm
- Registration form
- Field validations
- Visual feedback for errors
- Account creation

### FeriasForm
- Vacation request form
- Date validation
- Required fields
- Success/error feedback

### Dashboard
- Displays user requests
- Filters and sorting
- Actions available by status
- Intuitive interface

### AdminDashboard
- Complete request management
- Approval/Rejection of requests
- Detailed view
- Administrative controls

### Navbar
- Navigation bar with user profile
- Responsive design
- Quick access to main sections

### Footer
- Contains quick links and contact information
- Consistent design with the rest of the application

## Security

- Authentication via JWT
- Route protection
- Permission validation
- Error handling
- Data sanitization

## UI/UX Considerations

- Responsive design
- Clear visual feedback
- Informative error messages
- Smooth transitions
- Visual consistency
- Basic accessibility

## System Requirements

- Node.js 14+
- NPM or Yarn
- Internet connection
- Modern browser

## Installation and Execution

```bash
# Install dependencies
npm install

# Run in development (will run on port 3001)
npm run dev

# Build for production
npm run build

# Run in production
npm start
```

## Environment Variables

```env
# Backend API URL (running on port 3000)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Ports Configuration
- Backend API: runs on port 3000
- Frontend: runs on port 3001

## Best Practices

- Typed code with TypeScript
- Functional components
- React hooks
- Contextual state management
- Form validations
- Error handling
- User feedback

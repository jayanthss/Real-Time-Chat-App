# Chat Application - Full Stack Real-Time Messaging Platform

A modern, secure, and feature-rich real-time chat application built with React, Express.js, MongoDB, and Socket.io. The application enables users to communicate instantly with end-to-end encrypted messages, make video calls, and leverage AI-powered message suggestions.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Socket Events](#socket-events)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality

#### 1. **User Authentication & Authorization**
   - Secure user registration with password hashing (bcrypt)
   - JWT-based login with access and refresh tokens
   - Token expiration management (Access Token: 15 minutes, Refresh Token: 15 days)
   - Automatic token refresh mechanism
   - HTTP-only cookie storage for refresh tokens
   - User session management and logout functionality

#### 2. **Real-Time Messaging**
   - Instant message delivery using Socket.io WebSocket protocol
   - Persistent message storage in MongoDB
   - User search functionality with regex pattern matching
   - View all available users for communication
   - Identify online/offline user status in real-time
   - Graceful message handling with timestamp formatting

#### 3. **End-to-End Message Encryption**
   - AES-256-CBC encryption for all messages
   - Secure initialization vector (IV) generation for each message
   - Decryption on retrieval with stored keys
   - Military-grade security for private communications
   - Transparent encryption/decryption at application level

#### 4. **User Profiles & Avatars**
   - Multi-avatar selection from a library of unique avatars
   - Avatar image persistence in user profile
   - Customizable user profiles during registration
   - Avatar status tracking to ensure complete profiles

#### 5. **Video Calling (WebRTC)**
   - Peer-to-peer video calling capability
   - Real-time offer/answer negotiation
   - ICE candidate exchange for connection establishment
   - Video call notifications and status checks
   - Room-based video communication

#### 6. **AI-Powered Message Rewriting**
   - Message suggestion using Groq API (GPT model)
   - Professional message tone conversion
   - Preserve original meaning with creative rewriting
   - Friendly and casual tone adaptation
   - Emoji integration for enhanced expression

#### 7. **User Experience Enhancements**
   - Input validation for registration and login
   - Toast notifications for user feedback
   - Responsive design with Tailwind CSS
   - Loading indicators during async operations
   - 404 Page Not Found error handling
   - Server Down error page
   - Emoji picker for message enrichment
   - Form validation with custom validators

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.19
- **UI Components**: 
  - React Icons 5.5.0
  - React Router DOM 7.10.1
  - React Spinners 0.17.0
  - Emoji Picker React 4.16.1
- **HTTP Client**: Axios 1.13.2
- **Real-Time**: Socket.io Client 4.8.1
- **Notifications**: React Toastify 11.0.5
- **Utilities**: 
  - Multi-Avatar 1.0.7
  - JWT 9.0.3
- **Development Environment**: Node.js (v16+)

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 9.0.1
- **Real-Time**: Socket.io 4.8.1
- **Authentication**: 
  - JWT (jsonwebtoken 9.0.3)
  - bcrypt 6.0.0
- **Security**: 
  - CORS 2.8.5
  - Cookie Parser 1.4.7
- **Development**: Nodemon 3.1.11
- **Environment**: dotenv 17.2.3
- **AI Integration**: 
  - Groq API (@openrouter/sdk 0.3.14)
  - OpenAI Library 6.17.0
- **Encryption**: Node.js Crypto module
- **Package Manager**: npm

---

## 🏗 Project Architecture

### Frontend Architecture
```
Frontend/
├── src/
│   ├── pages/                 # Route pages
│   │   ├── login.jsx         # Login page with form validation
│   │   ├── register.jsx      # Registration with input validation
│   │   ├── chat.jsx          # Main chat interface
│   │   ├── setAvatar.jsx     # Avatar selection page
│   │   └── VideoCaller.jsx   # Video call page
│   ├── components/            # Reusable components
│   │   ├── Auth Forms/       # Authentication forms
│   │   ├── Button/           # Button components
│   │   ├── Input/            # Input field components
│   │   ├── Main/             # Main chat components
│   │   └── Error_Components/ # Error pages
│   ├── factories/             # Component factories
│   ├── utils/                 # API routes & helpers
│   ├── Validations/          # Form validators
│   ├── api/                   # API configuration
│   ├── socket.js             # Socket.io client setup
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
├── package.json
└── vite.config.js
```

### Backend Architecture
```
Backend/
├── Chat-app-Server/
│   ├── controller/            # Business logic
│   │   ├── usercontroller.js # User operations
│   │   ├── messagesController.js # Message handling
│   │   ├── aiController.js   # AI features
│   │   └── enrypt_decrypt.js # Encryption logic
│   ├── model/                 # MongoDB schemas
│   │   ├── userModel.js      # User schema
│   │   └── MessageModel.js   # Message schema
│   ├── routes/                # API endpoints
│   │   ├── userRoutes.js     # Auth & user routes
│   │   ├── messagesRoutes.js # Message routes
│   │   └── aiRoutes.js       # AI routes
│   ├── Auth/                  # Authentication
│   │   └── jwt.js            # JWT middleware & token generation
│   ├── Socket/                # Real-time communication
│   │   └── socket.js         # Socket.io handlers
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   ├── db.js                 # MongoDB connection
│   └── package.json
```

---

## 📦 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **MongoDB** (Local or Cloud - MongoDB Atlas)
- **Groq API Key** (for AI message rewriting)
- **Modern web browser** with WebRTC support (for video calls)
- **Git** for version control

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd chat\ app
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd Backend/Chat-app-Server

# Install dependencies
npm install

# Create .env file
touch .env
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd Frontend/chat-app-client

# Install dependencies
npm install

# Create .env file
touch .env.local
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5000

# MongoDB Connection
Mongo_Url=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database-name>?retryWrites=true&w=majority

# JWT Secrets
safe_key=<your-256-bit-hex-secret-key>

# Encryption
secret_key=<your-256-bit-hex-encryption-key>

# Groq API (for AI features)
api_key=<your-groq-api-key>
```

### Frontend Environment Variables (.env.local)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Generating Secure Keys

```bash
# Generate 256-bit hex keys for JWT and Encryption
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎯 Running the Application

### Backend Server

```bash
cd Backend/Chat-app-Server

# Using npm (with nodemon for auto-reload)
npm start

# Server will run on http://localhost:5000
```

### Frontend Development Server

```bash
cd Frontend/chat-app-client

# Start development server
npm run dev

# Application will be available at http://localhost:5173
```

### Production Build

```bash
# Frontend build
npm run build

# Preview production build
npm run preview
```

---

## 📡 API Endpoints

### User Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration
| POST | `/api/auth/login` | User login
| POST | `/api/auth/setAvatar/:id` | Set user avatar
| POST | `/api/auth/refresh` | Refresh access token
| POST | `/api/auth/logout` | User logout 
| GET | `/api/auth/alluser/:id` | Get all users except self
| POST | `/api/auth/tokenCheck` | Verify token validity
| POST | `/api/auth/getUser` | Get user details
| POST | `/api/auth/searchUser` | Search users by username

### Messaging

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/addmsg` | Send encrypted message
| POST | `/api/messages/getmsg` | Retrieve messages

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/rewrite` | Rewrite message using AI

---

## 🛡️ Error Handling

### Backend Error Handling

#### 1. **Authentication & Authorization Errors**
   - **Missing Token**: Returns 404 status with "token not found" message
   - **Invalid Token**: Returns 401 status with "invalid token" message
   - **Token Expiration**: Automatic refresh via refresh token mechanism
   - **Unauthorized Access**: JWT middleware validates all protected routes

#### 2. **User Validation Errors**
   - **Duplicate Username**: Returns "Username Already taken" message
   - **Duplicate Email**: Returns "email Already taken" message
   - **Invalid Credentials**: Returns "Username or password incorrect" message
   - **Password Mismatch**: Returns "incorrect password" message
   - **User Not Found**: Returns 404 status with "User not found" message

#### 3. **Message Handling Errors**
   - **Missing Required Fields**: Validates `from`, `to`, and `message` parameters
   - **Encryption/Decryption Errors**: Caught in try-catch blocks
   - **Database Save Failures**: Returns "Fail to add message to the database"

#### 4. **Database Errors**
   - **Connection Errors**: Logged with detailed error messages
   - **Query Failures**: Caught and passed to error middleware
   - **Validation Schema Errors**: MongoDB schema validation enforces:
     - Username: 3-50 characters, unique requirement
     - Email: max 50 characters, unique requirement
     - Password: minimum 8 characters

#### 5. **AI Service Errors**
   - **API Failures**: Returns 400 status with error description
   - **Invalid Requests**: Proper error messages sent to frontend

#### 6. **Socket.io Errors**
   - **Connection Failures**: Automatic reconnection with exponential backoff
   - **Room Join Errors**: Graceful handling of unavailable rooms
   - **Emit Failures**: Error logs for socket message delivery

### Frontend Error Handling

#### 1. **Toast Notifications**
```javascript
const toast_options = {
  position: "bottom-right",
  theme: "dark",
  pauseOnHover: true,
  draggable: true,
  autoClose: 4000,
};

// Usage
toast.error("Error message", toast_options);
toast.success("Success message", toast_options);
```

#### 2. **Form Validation**
   - **Email Validation**: RFC 5322 compliant pattern matching
   - **Password Validation**: Minimum 8 characters, special characters
   - **Username Validation**: 3-50 characters, alphanumeric
   - **Real-time error display**: Inline validation feedback

#### 3. **Route Protection**
   - **Protected Routes**: JWT token verification before access
   - **Redirect on Auth Failure**: Automatic redirect to login
   - **Session Persistence**: Token stored in localStorage

#### 4. **Error Pages**
   - **404 Page Not Found**: Custom error page for invalid routes
   - **Server Down Page**: Displays when backend is unavailable
   - **Loading States**: Spinner indicators during async operations

#### 5. **API Error Interceptors**
```javascript
// Axios interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle token expiration
      // Attempt token refresh
    }
    return Promise.reject(error);
  }
);
```

#### 6. **Network Errors**
   - **Socket.io Disconnection**: Automatic reconnection attempts
   - **Timeout Errors**: Configurable timeout handling
   - **Offline Detection**: Real-time online/offline status

---

## 🔌 Socket Events

### Client-to-Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `roomid` | Join a video call room |
| `add-user` | `userId` | Register user as online |
| `send-msg` | `{ to, message }` | Send message to user |
| `video-call` | `{ caller, reciver }` | Initiate video call |
| `ready-to-get-offer` | `roomId` | Signal readiness for WebRTC |
| `offer` | `roomId, offer` | Send WebRTC offer |
| `answer` | `roomId, answer` | Send WebRTC answer |
| `ice-candidate` | `roomId, candidate` | Send ICE candidate |
| `disconnect` | - | User disconnection |

### Server-to-Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `online-users` | `[userIds]` | List of online users |
| `msg-recieve` | `message` | Incoming message |
| `video-call-by-someone` | `{ from, callerSocketId }` | Incoming call notification |
| `reciver-ready` | `"yes"` | Receiver ready for offer |
| `offer` | `offer` | WebRTC offer received |
| `answer` | `answer` | WebRTC answer received |
| `candiate` | `candidate` | ICE candidate received |

---

## 🔐 Security Features

### 1. **End-to-End Encryption**
- **Algorithm**: AES-256-CBC (Advanced Encryption Standard)
- **Key Length**: 256-bit hexadecimal key
- **IV Generation**: Random 16-byte initialization vector for each message
- **Implementation**: Transparent encryption before storage, decryption on retrieval

### 2. **Authentication Security**
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: HS256 algorithm for token signing
- **Access Token**: 15-minute expiration for session security
- **Refresh Token**: 15-day rotation for long-term access
- **HTTP-Only Cookies**: Refresh tokens stored with HttpOnly flag (immune to XSS)

### 3. **CORS Configuration**
```javascript
cors({
  origin: "http://localhost:5173",
  credentials: true,
})
```

### 4. **Input Validation**
- Schema-based validation using Mongoose
- Regex pattern matching for user search
- Length constraints on username, email, password
- Email uniqueness enforcement
- Username uniqueness enforcement

### 5. **Token Refresh Mechanism**
- Automatic token refresh when access token expires
- Secure refresh token verification against database
- Cookie-based refresh token transmission
- Protected token endpoints

### 6. **Data Protection**
- Sensitive passwords excluded from API responses
- User IDs used for secure identification
- Message sender verification before decryption
- Timestamp validation for message ordering

---

## 📁 Project Structure Details

### Key Files

**Backend**
- `server.js`: Server initialization and Socket.io setup
- `app.js`: Express middleware and route configuration
- `db.js`: MongoDB connection with error handling
- `controllers/`: Business logic for all features
- `Auth/jwt.js`: JWT generation and middleware
- `Socket/socket.js`: Real-time event handlers

**Frontend**
- `App.jsx`: Main routing component
- `socket.js`: Socket.io client configuration
- `api/axios.js`: HTTP client setup with interceptors
- `pages/`: Complete application pages
- `components/`: Modular UI components
- `utils/ApiRoutes.js`: Centralized API endpoint definitions

---



## 📞 Support & Contact

For issues, feature requests, or questions:
- Open an issue on GitHub

---

## 🎉 Acknowledgments

- Socket.io for real-time communication
- Groq API for AI-powered features
- MongoDB for reliable data storage
- React and Express communities for excellent documentation
- Tailwind CSS for responsive design utilities

---

**Happy Chatting! 🚀**

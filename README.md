# 🎥 SafeStream – Video Moderation & Streaming Platform

SafeStream is a **full-stack, production-grade video moderation platform** built as part of a hiring assignment.  
It supports secure video uploads, real-time processing updates, role-based access control, and HTTP-based video streaming.

The application is designed to demonstrate **system design, scalability, real-time communication, and clean architecture**.

---

## 🚀 Live Demo

- **Frontend**: https://safestream-xi.vercel.app
  
---

## 🧠 Problem Statement

Modern platforms require automated moderation and controlled access to user-generated video content.  
SafeStream solves this by:

- Allowing users to upload videos
- Processing videos asynchronously
- Flagging sensitive content
- Enforcing role-based access
- Streaming videos securely and efficiently

---

## 🏗️ System Architecture

### Frontend
- React (Vite)
- Tailwind CSS
- Socket.io Client
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Socket.io
- Multer (file uploads)
- JWT Authentication

### Communication Flow
 - Client → Upload Video → Backend
 - Backend → Async Processing → Socket.io Events
 - Client → Live Progress Updates
 - Client → Secure Video Streaming (HTTP Range)


---

## 👥 User Roles & Permissions

| Role   | View Videos | Upload | Flag | Delete | Manage Users |
|------|------------|--------|------|--------|--------------|
| Viewer | SAFE only | ❌ | ❌ | ❌ | ❌ |
| Editor | SAFE | ✅ | ✅ | ❌ | ❌ |
| Admin | SAFE & FLAGGED | ✅ | ✅ | ✅ | ✅ |

---

## ✨ Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected routes (frontend & backend)

---

### 🎬 Video Upload
- Secure video upload using Multer
- Metadata stored in MongoDB
- Asynchronous processing pipeline

---

### ⏱️ Real-Time Processing (Socket.io)
- Live processing progress updates
- Progress displayed using dynamic progress bars
- UI updates automatically without page refresh

---

### 🛡️ Content Moderation
- Videos marked as SAFE or FLAGGED after processing
- Viewers are restricted from accessing FLAGGED videos
- Editors/Admins can flag or unflag content

---

### 📺 Secure Video Streaming
- HTTP Range-based streaming
- Supports seeking and partial content (206)
- JWT-protected access using signed query tokens

---

### 🧑‍💼 Admin Panel
- View all registered users
- Change user roles dynamically
- Role updates persist in database
- Admin cannot demote themselves

---

### 📱 Responsive UI
- Mobile-first responsive design
- Sidebar navigation with active state highlighting
- Clean, professional SaaS-style UI

---

## ⚙️ Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_URL=https://safestream.vercel.app



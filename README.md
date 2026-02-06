# 📋 Kanban Board - Full-Stack Task Management Application

A full-stack task management application built with **React 18**, **Express.js**, and **Supabase**. This project demonstrates clean architecture, and industry best practices.

![Tech Stack](https://img.shields.io/badge/React-18.2.0-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express.js-green?logo=node.js) ![Database](https://img.shields.io/badge/Database-Supabase-black?logo=supabase) ![Vite](https://img.shields.io/badge/Build-Vite-purple?logo=vite)

---

## ✨ Features

- **Create Tasks** - Add tasks with title and optional description
- **Organize Tasks** - Three columns: To Do, In Progress, Done
- **Drag & Drop** - Move tasks between columns with HTML5 native API
- **Data Persistence** - All tasks saved to Supabase (survives page reload)
- **Real-time UI** - Optimistic updates for instant feedback
- **Error Handling** - Graceful error messages and loading states
- **Activity Logging** - Track task movements and operations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ ([nodejs.org](https://nodejs.org/))
- Supabase account ([supabase.com](https://supabase.com)) - free tier works

### Local Development (3 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/shivani-thakur/kanban-board.git
cd kanban-board

# 2. Setup Backend
cd server
npm install
cp .env.example .env
# ↓ Edit .env with your Supabase credentials ↓
npm run dev

# 3. Setup Frontend (new terminal)
cd client
npm install
cp .env.example .env
npm run dev

# 4. Open http://localhost:3000
# Done! Create tasks and drag them between columns
```

---

## 📊 Live Demo

| Component | Link |
|-----------|------|
| **Frontend** | https://kanban-board-ivory-seven-72.vercel.app |
| **Backend API** | https://kanban-server-x591.onrender.com/api |

Try it: Create a task, drag it to "In Progress", refresh the page — data persists! ✨

---

## 📁 Project Structure

```
kanban-board/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Board, Column, TaskCard, Form
│   │   ├── hooks/            # useTasks custom hook
│   │   ├── services/         # API client (Axios)
│   │   └── App.jsx
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── controllers/      # HTTP request handlers
│   │   ├── services/         # Business logic & DB ops
│   │   ├── db/              # Supabase client
│   │   ├── middleware/       # Error handling
│   │   ├── routes/          # API endpoints
│   │   └── index.js
│   └── package.json
│
├── README.md                  # Main documentation
├── ARCHITECTURE.md            # Technical deep dive
├── SETUP_GUIDE.md             # Setup & deployment
├── API_DOCUMENTATION.md       # API reference
└── CODE_OVERVIEW.md           # Quick code reference
```

**Architecture**: Separation of concerns with controllers → services → database layers.

---

## 🏗️ Architecture

```
Frontend (React)              Backend (Express)           Database (Supabase)
┌─────────────────┐          ┌──────────────────┐        ┌──────────────┐
│   Board         │          │ Controller       │        │  PostgreSQL  │
│   ├─ Column     │◄─────────┤ ├─ Handler       │◄───────┤  tasks       │
│   │  ├─ TaskCard│  HTTP    │ └─ Validation    │        │ activity_log │
│   └─ Form       │          │                  │        └──────────────┘
│                 │          │ Service          │
│ useTasks Hook   │          │ ├─ CRUD Logic    │
│ (State Mgmt)    │          │ └─ Validation    │
│                 │          │                  │
│ API Service     │          │ Error Handler    │
│ (Axios)         │          │ ├─ Validation    │
└─────────────────┘          │ └─ CORS          │
                             └──────────────────┘
```

---

## 📊 Database Schema

### SQL Commands to Run in Supabase SQL Editor

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'todo',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on position for ordering within columns
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);

-- Create activity log table (optional, for nice-to-have feature)
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table Structure**:
- **tasks**: Stores all task data with status-based organization
- **activity_log**: Tracks task history (optional feature)

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks (optional: `?status=todo`) |
| `POST` | `/tasks` | Create new task |
| `PUT` | `/tasks/:id` | Update task title/description |
| `PATCH` | `/tasks/:id/move` | Move task to different column |
| `DELETE` | `/tasks/:id` | Delete task |
| `GET` | `/tasks/activity/log` | Get activity log |

**Example**: Create a task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Kanban", "description": "Master task management"}'
```

**Full API docs?** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework with hooks
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client with interceptors
- **HTML5 Drag-and-Drop** - Native browser API (no heavy libraries)

### Backend
- **Express.js** - Minimal web framework
- **Node.js** - JavaScript runtime
- **Service Layer Pattern** - Clean separation of concerns

### Database
- **Supabase** - PostgreSQL database with REST API
- **Indexes** - On status and position for query performance

### Deployment
- **Vercel** - Frontend hosting (zero-config)
- **Render** - Backend hosting (free tier available)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Main documentation with features and troubleshooting |
| **API_DOCUMENTATION.md** | Complete API reference with examples |

---

## 🚀 Deployment

### Frontend to Vercel (1 click)
```bash
# Push to GitHub → Vercel auto-deploys
git push origin main
# Then go to vercel.com, import repo, set root to ./client
# Done! Frontend live
```

### Backend to Render (5 minutes)
```bash
# Go to render.com
# Create Web Service → Connect GitHub
# Root directory: ./server
# Add environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
# Done! Backend live
```


---

## 💡 Design Decisions

### Why No Redux?
Redux adds complexity for 1 piece of state (tasks). A custom `useTasks` hook is cleaner and sufficient.

### Why HTML5 Drag-and-Drop?
No external library dependencies. The native API is powerful enough and keeps bundle size small.

### Why Service Layer?
Separates business logic from HTTP logic. Makes testing easier and allows reusing services for multiple interfaces (REST, GraphQL, etc.).

### Why Supabase?
- Managed PostgreSQL (no DevOps)
- Free tier (500MB)
- Scales to production
- Built-in Auth (for future features)

---


## 🤝 Trade-offs Made

| Trade-off | Decision | Why |
|-----------|----------|-----|
| State Management | No Redux/Zustand | Overkill for single board |
| Styling | Inline styles | No CSS framework, cleaner code |
| Drag Library | HTML5 native | Lightweight, fewer dependencies |
| Auth | None | Out of scope, can add later |
| Real-time Updates | Polling | Simpler than WebSockets |
| Error Handling | Basic try-catch | Sufficient for MVP |

---

## 🧪 Testing

### Manual Test Cases
- Create task → appears in "To Do"
- Drag task → moves to new column
- Refresh page → task stays in new column
- Delete task → removed from board
- Stop backend → error message appears

---

## 📝 License

This project is open source and available under the **MIT License**.

---

<div align="center">

**[🎯 See Live Demo](https://kanban-board-ivory-seven-72.vercel.app)** • **[⭐ Star this repo!](https://github.com/shivani-thakur/kanban-board.git)**

</div>

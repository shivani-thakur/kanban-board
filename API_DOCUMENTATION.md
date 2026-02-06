# API Documentation

Complete reference for all Kanban Board API endpoints.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://kanban-server.onrender.com/api`

## Authentication

Currently, **no authentication is required**. All endpoints are publicly accessible.

---

## Endpoints

### 1. Get All Tasks

**Endpoint**: `GET /tasks`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string (optional) | Filter by status: `todo`, `inprogress`, `done` |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Design mockups",
      "description": "Create UI mockups in Figma",
      "status": "todo",
      "position": 0,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Implement backend",
      "description": "Build Express API",
      "status": "inprogress",
      "position": 0,
      "created_at": "2024-01-15T10:32:00Z",
      "updated_at": "2024-01-15T10:32:00Z"
    }
  ]
}
```

**Examples**:

Get all tasks:
```bash
curl http://localhost:5000/api/tasks
```

Get only "todo" tasks:
```bash
curl http://localhost:5000/api/tasks?status=todo
```

---

### 2. Get Single Task

**Endpoint**: `GET /tasks/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Task ID (from URL) |

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design mockups",
    "description": "Create UI mockups in Figma",
    "status": "todo",
    "position": 0,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Task not found"
}
```

**Example**:
```bash
curl http://localhost:5000/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

---

### 3. Create Task

**Endpoint**: `POST /tasks`

**Request Body**:
```json
{
  "title": "Design database schema",
  "description": "Plan table structure and relationships",
  "status": "todo"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Task title (1-255 chars) |
| `description` | string | ✗ | Task details (0-5000 chars) |
| `status` | string | ✗ | Default: `todo`. Options: `todo`, `inprogress`, `done` |

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Design database schema",
    "description": "Plan table structure and relationships",
    "status": "todo",
    "position": 5,
    "created_at": "2024-01-15T10:35:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Title is required"
}
```

**Examples**:

With cURL:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix login bug",
    "description": "Users cant login with Google",
    "status": "inprogress"
  }'
```

With JavaScript (Fetch):
```javascript
const response = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Fix login bug',
    description: 'Users cant login with Google',
    status: 'inprogress'
  })
});
const data = await response.json();
console.log(data.data); // New task object
```

With Axios:
```javascript
const newTask = await axios.post('http://localhost:5000/api/tasks', {
  title: 'Fix login bug',
  description: 'Users cant login with Google',
  status: 'inprogress'
});
console.log(newTask.data.data);
```

---

### 4. Update Task

**Endpoint**: `PUT /tasks/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Task ID (from URL) |

**Request Body** (all fields optional):
```json
{
  "title": "Updated task title",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "todo",
    "position": 0,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:40:00Z"
  }
}
```

**Example**:
```bash
curl -X PUT http://localhost:5000/api/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review API documentation",
    "description": "Make sure all endpoints are documented"
  }'
```

**Note**: Cannot update `status` here — use the **Move Task** endpoint instead.

---

### 5. Move Task

**Endpoint**: `PATCH /tasks/:id/move`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Task ID (from URL) |

**Request Body** (both required):
```json
{
  "status": "inprogress",
  "position": 0
}
```

**Body Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | ✓ | New status: `todo`, `inprogress`, `done` |
| `position` | number | ✓ | New position in column (0-based index) |

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design mockups",
    "description": "Create UI mockups in Figma",
    "status": "inprogress",
    "position": 0,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:42:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid status"
}
```

**Example**:
```bash
curl -X PATCH http://localhost:5000/api/tasks/550e8400-e29b-41d4-a716-446655440000/move \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inprogress",
    "position": 0
  }'
```

**What happens**:
1. Task is moved to new status column
2. Task is placed at specified position
3. Other tasks in that column are reordered (positions renumbered)
4. Activity is logged

---

### 6. Delete Task

**Endpoint**: `DELETE /tasks/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Task ID (from URL) |

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted"
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Task not found"
}
```

**Example**:
```bash
curl -X DELETE http://localhost:5000/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**What happens**:
1. Task is deleted from database
2. Other tasks in that column are reordered
3. Activity is logged

---

### 7. Get Activity Log

**Endpoint**: `GET /activity/log`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number (optional) | Max activities to return (default: 50, max: 1000) |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "action": "task_created",
      "task_id": "550e8400-e29b-41d4-a716-446655440000",
      "details": {
        "title": "Design mockups",
        "status": "todo"
      },
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "action": "task_moved",
      "task_id": "550e8400-e29b-41d4-a716-446655440000",
      "details": {
        "from": "todo",
        "to": "inprogress"
      },
      "created_at": "2024-01-15T10:42:00Z"
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:5000/api/activity/log?limit=10
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request succeeded |
| 201 | Created | Task was created |
| 400 | Bad Request | Invalid input (missing title, invalid status) |
| 404 | Not Found | Task ID doesn't exist |
| 500 | Server Error | Database connection failed |

**Example Error Response**:
```bash
$ curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "No title"}'

# Response (400):
{
  "success": false,
  "error": "Title is required"
}
```

---

## Data Types

### Task Object

```typescript
interface Task {
  id: string;              // UUID, unique identifier
  title: string;           // Task name (1-255 chars)
  description: string;     // Optional details (0-5000 chars)
  status: 'todo' | 'inprogress' | 'done';
  position: number;        // Order within column (0-based)
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### Activity Log Entry

```typescript
interface ActivityLog {
  id: string;              // UUID, unique identifier
  action: string;          // 'task_created' | 'task_moved' | 'task_deleted'
  task_id: string;         // UUID of affected task
  details: object;         // Action-specific details
  created_at: string;      // ISO 8601 timestamp
}
```

---

## Rate Limiting

**Currently**: No rate limiting. Each endpoint accepts unlimited requests.

**Future**: Could add rate limiting (e.g., 100 requests per minute per IP).

---

## CORS Configuration

The API accepts requests from:
- **Development**: `http://localhost:3000`
- **Production**: `https://kanban-board.vercel.app` (or your Vercel domain)

Configured in `server/src/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Example: Complete Workflow

### 1. Create a task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write documentation",
    "description": "Document all API endpoints",
    "status": "todo"
  }'
# Returns task with id: abc123
```

### 2. Move it to "In Progress"
```bash
curl -X PATCH http://localhost:5000/api/tasks/abc123/move \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inprogress",
    "position": 0
  }'
```

### 3. Update the title
```bash
curl -X PUT http://localhost:5000/api/tasks/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write API documentation"
  }'
```

### 4. Move to "Done"
```bash
curl -X PATCH http://localhost:5000/api/tasks/abc123/move \
  -H "Content-Type: application/json" \
  -d '{
    "status": "done",
    "position": 0
  }'
```

### 5. Delete it
```bash
curl -X DELETE http://localhost:5000/api/tasks/abc123
```

---

## Testing the API

### With Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create request to `http://localhost:5000/api/tasks`
3. Test each endpoint

### With cURL (Command Line)

All examples in this document use cURL. Just copy-paste into terminal.

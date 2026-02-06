import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

/**
 * Task Routes
 * Defines all API endpoints related to tasks
 */

// GET /api/tasks - Get all tasks (optionally filtered by status)
router.get('/', taskController.getTasks);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', taskController.getTask);

// POST /api/tasks - Create a new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', taskController.updateTask);

// PATCH /api/tasks/:id/move - Move a task to a different column
router.patch('/:id/move', taskController.moveTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask);

// GET /api/tasks/activity/log - Get activity log
router.get('/activity/log', taskController.getActivityLog);

export default router;

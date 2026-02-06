import * as taskService from '../services/taskService.js';

/**
 * Task Controller
 * Handles HTTP requests and responses for task-related operations.
 * Controllers are the entry point for API requests.
 */

// Get all tasks (with optional status filter)
export async function getTasks(req, res, next) {
  try {
    const { status } = req.query;
    const tasks = await taskService.getAllTasks(status);
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

// Get a single task by ID
export async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

// Create a new task
export async function createTask(req, res, next) {
  try {
    const { title, description, status } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = await taskService.createTask(
      title.trim(),
      description?.trim() || '',
      status || 'todo'
    );
    
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

// Update a task
export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    // Validation
    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    
    const task = await taskService.updateTask(id, updates);
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

// Move a task to a different column or position
export async function moveTask(req, res, next) {
  try {
    const { id } = req.params;
    const { status, position } = req.body;
    
    // Validation
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    if (position === undefined || typeof position !== 'number') {
      return res.status(400).json({ error: 'Valid position is required' });
    }
    
    const validStatuses = ['todo', 'inprogress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const task = await taskService.moveTask(id, status, position);
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

// Delete a task
export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
}

// Get activity log
export async function getActivityLog(req, res, next) {
  try {
    const { limit } = req.query;
    const activities = await taskService.getActivityLog(limit ? parseInt(limit) : 50);
    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
}

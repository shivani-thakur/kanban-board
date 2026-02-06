import { useState, useCallback, useEffect } from 'react';
import { taskAPI } from '../services/api.js';

/**
 * Custom Hooks
 * Encapsulate logic for data fetching and state management.
 * This promotes code reusability and separation of concerns.
 */

/**
 * useTasks Hook
 * Manages all task-related state and operations.
 * Returns state and methods to manipulate tasks.
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all tasks from API
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskAPI.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add a new task
  const addTask = useCallback(async (title, description = '', status = 'todo') => {
    try {
      const newTask = await taskAPI.createTask(title, description, status);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err;
    }
  }, []);

  // Update an existing task
  const updateTaskLocal = useCallback(async (id, updates) => {
    try {
      const updatedTask = await taskAPI.updateTask(id, updates);
      setTasks(prev => 
        prev.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      throw err;
    }
  }, []);

  // Move a task to a different column
  const moveTaskLocal = useCallback(async (id, newStatus, newPosition) => {
    try {
      const updatedTask = await taskAPI.moveTask(id, newStatus, newPosition);
      setTasks(prev => 
        prev.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err.message || 'Failed to move task');
      throw err;
    }
  }, []);

  // Delete a task
  const deleteTaskLocal = useCallback(async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  }, []);

  // Get tasks by status (computed)
  const getTasksByStatus = useCallback((status) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTaskLocal,
    moveTaskLocal,
    deleteTaskLocal,
    getTasksByStatus
  };
}

/**
 * useAsync Hook
 * Generic hook for handling async operations with loading and error states.
 * Useful for form submissions and other one-off async operations.
 */
export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState(immediate ? 'loading' : 'idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('loading');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, [execute, immediate]);

  return { execute, status, data, error };
}

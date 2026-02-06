import React, { useState } from 'react';
import { Column } from './Column.jsx';
import { CreateTaskForm } from './CreateTaskForm.jsx';
import { useTasks } from '../hooks/useTasks.js';

/**
 * Board Component
 * Main component that orchestrates the entire Kanban board.
 * Manages task operations and coordinates between child components.
 */

const COLUMN_CONFIG = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'inprogress' },
  { title: 'Done', status: 'done' }
];

export function Board() {
  const {
    tasks,
    loading,
    error,
    addTask,
    moveTaskLocal,
    deleteTaskLocal,
    getTasksByStatus
  } = useTasks();

  const [isCreating, setIsCreating] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  // Handle task creation
  const handleTaskCreate = async (title, description) => {
    setIsCreating(true);
    try {
      await addTask(title, description, 'todo');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle drag start
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  // Handle task drop (move to different column)
  const handleTaskDrop = async (taskId, newStatus, newPosition) => {
    try {
      await moveTaskLocal(taskId, newStatus, newPosition);
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskLocal(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: '#333'
        }}>
          Kanban Board
        </h1>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#666'
        }}>
          Organize your tasks across different stages
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          border: '1px solid #fcc'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Create Task Form */}
      <CreateTaskForm 
        onTaskCreate={handleTaskCreate}
        isLoading={isCreating}
      />

      {/* Loading State */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          color: '#666',
          fontSize: '16px'
        }}>
          Loading tasks...
        </div>
      ) : (
        /* Board Columns */
        <div style={{
          display: 'flex',
          gap: '16px',
          height: 'auto'
        }}>
          {COLUMN_CONFIG.map((column) => (
            <Column
              key={column.status}
              columnTitle={column.title}
              columnStatus={column.status}
              tasks={getTasksByStatus(column.status)}
              onTaskDrop={handleTaskDrop}
              onTaskDelete={handleTaskDelete}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '32px',
        paddingTop: '16px',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        fontSize: '12px',
        color: '#999'
      }}>
        Total Tasks: {tasks.length} | 
        To Do: {getTasksByStatus('todo').length} | 
        In Progress: {getTasksByStatus('inprogress').length} | 
        Done: {getTasksByStatus('done').length}
      </div>
    </div>
  );
}

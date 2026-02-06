import React, { useState } from 'react';
import { TaskCard } from './TaskCard.jsx';

/**
 * Column Component
 * Represents a single column in the Kanban board (Todo, In Progress, Done).
 * Handles drag-over and drop events for moving tasks between columns.
 */

export function Column({
  columnTitle,
  columnStatus,
  tasks,
  onTaskDrop,
  onTaskDelete,
  onDragStart
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const draggedTask = JSON.parse(e.dataTransfer.getData('task'));
      onTaskDrop(draggedTask.id, columnStatus, tasks.length);
    } catch (err) {
      console.error('Error dropping task:', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: 1,
        minHeight: '500px',
        backgroundColor: isDragOver ? '#f0f0f0' : '#fafafa',
        border: isDragOver ? '2px dashed #007bff' : '1px solid #ddd',
        borderRadius: '6px',
        padding: '16px',
        transition: 'all 0.2s'
      }}
    >
      <h2 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: '700',
        color: '#333',
        textTransform: 'uppercase'
      }}>
        {columnTitle}
      </h2>
      
      <div style={{ minHeight: '50px' }}>
        {tasks.length === 0 ? (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: '#999',
            fontSize: '14px'
          }}>
            No tasks yet. Drag tasks here.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDelete={onTaskDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

/**
 * TaskCard Component
 * Represents a single task in the Kanban board.
 * Handles drag functionality and displays task information.
 */

export function TaskCard({ 
  task, 
  onDragStart, 
  onDelete 
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        cursor: 'grab',
        opacity: isHovering ? 0.8 : 1,
        transition: 'opacity 0.2s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            {task.title}
          </h4>
          {task.description && (
            <p style={{
              margin: '0',
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.4'
            }}>
              {task.description}
            </p>
          )}
          {task.created_at && (
            <span style={{
              fontSize: '11px',
              color: '#999',
              marginTop: '8px',
              display: 'block'
            }}>
              {new Date(task.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
        {isHovering && (
          <button
            onClick={() => onDelete(task.id)}
            style={{
              padding: '4px 8px',
              marginLeft: '8px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

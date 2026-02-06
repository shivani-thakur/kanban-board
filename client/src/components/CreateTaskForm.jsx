import React, { useState } from 'react';

/**
 * CreateTaskForm Component
 * Form for creating new tasks. Includes title and description fields.
 */

export function CreateTaskForm({ onTaskCreate, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      await onTaskCreate(title, description);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: '#f9f9f9',
      borderRadius: '6px',
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Create New Task
      </h3>

      {error && (
        <div style={{
          marginBottom: '12px',
          padding: '8px 12px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#333'
        }}>
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            opacity: isLoading ? 0.6 : 1
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#333'
        }}>
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            resize: 'none',
            minHeight: '60px',
            opacity: isLoading ? 0.6 : 1
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {isLoading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}

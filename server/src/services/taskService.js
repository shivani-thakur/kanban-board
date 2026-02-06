import supabase from '../db/supabase.js';

/**
 * Task Service Layer
 * Handles all database operations related to tasks.
 * This follows the Service Layer pattern for clean separation of concerns.
 */

// Get all tasks, optionally filtered by status
export async function getAllTasks(status = null) {
  try {
    let query = supabase.from('tasks').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('position', { ascending: true });
    
    // LOG THE ERROR
    if (error) {
      console.error('Supabase Error Details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

// Get a single task by ID
export async function getTaskById(id) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Task not found');
  }
}

// Create a new task
export async function createTask(title, description = '', status = 'todo') {
  try {
    // Get the highest position in this status column to insert at the end
    const { data: existingTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('position')
      .eq('status', status)
      .order('position', { ascending: false })
      .limit(1);
    
    if (fetchError) throw fetchError;
    
    const nextPosition = existingTasks && existingTasks.length > 0 
      ? existingTasks[0].position + 1 
      : 0;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          status,
          position: nextPosition
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity (optional feature)
    await logActivity('task_created', data.id, { title, status });
    
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}

// Update task title and description
export async function updateTask(id, updates) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
}

// Move task to a different column (update status and position)
export async function moveTask(taskId, newStatus, newPosition) {
  try {
    // Get the task being moved
    const task = await getTaskById(taskId);
    const oldStatus = task.status;
    
    // If moving within the same column
    if (oldStatus === newStatus) {
      // Update the position of the moved task
      const { data, error } = await supabase
        .from('tasks')
        .update({ position: newPosition })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Reorder other tasks in the same column
      await reorderTasksInColumn(newStatus, taskId);
      
      return data;
    } else {
      // Moving to a different column
      // Get the maximum position in the new column
      const { data: existingTasks, error: fetchError } = await supabase
        .from('tasks')
        .select('position')
        .eq('status', newStatus)
        .order('position', { ascending: false })
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      const maxPosition = existingTasks && existingTasks.length > 0 
        ? existingTasks[0].position + 1 
        : 0;
      
      // Update task with new status and position
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          position: maxPosition,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Clean up positions in old column
      await reorderTasksInColumn(oldStatus);
      
      // Log activity
      await logActivity('task_moved', taskId, { from: oldStatus, to: newStatus });
      
      return data;
    }
  } catch (error) {
    console.error('Error moving task:', error);
    throw new Error('Failed to move task');
  }
}

// Reorder tasks in a column to ensure sequential positions
async function reorderTasksInColumn(status, excludeTaskId = null) {
  try {
    let query = supabase
      .from('tasks')
      .select('id')
      .eq('status', status)
      .order('position', { ascending: true });
    
    if (excludeTaskId) {
      query = query.neq('id', excludeTaskId);
    }
    
    const { data: tasks, error } = await query;
    
    if (error) throw error;
    
    // Update positions
    if (tasks && tasks.length > 0) {
      const updates = tasks.map((task, index) => ({
        id: task.id,
        position: index
      }));
      
      for (const update of updates) {
        await supabase
          .from('tasks')
          .update({ position: update.position })
          .eq('id', update.id);
      }
    }
  } catch (error) {
    console.error('Error reordering tasks:', error);
    throw new Error('Failed to reorder tasks');
  }
}

// Delete a task
export async function deleteTask(id) {
  try {
    const task = await getTaskById(id);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Clean up positions in the task's column
    await reorderTasksInColumn(task.status);
    
    // Log activity
    await logActivity('task_deleted', id, { title: task.title });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}

// Log activity
async function logActivity(action, taskId, details = {}) {
  try {
    await supabase.from('activity_log').insert([
      {
        action,
        task_id: taskId,
        details
      }
    ]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Get activity log
export async function getActivityLog(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching activity log:', error);
    return [];
  }
}

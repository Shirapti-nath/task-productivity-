'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
}

type Toast = {
  type: 'error' | 'success';
  message: string;
} | null;

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = error.response.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const message = data.message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      if (typeof message === 'string') {
        return message;
      }
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Failed to create task';
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'COMPLETED').length;
    const pending = tasks.filter((task) => task.status === 'PENDING').length;

    return {
      total: tasks.length,
      completed,
      pending,
    };
  }, [tasks]);

  const showToast = useCallback((type: 'error' | 'success', message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<Task[]>('/tasks');
      setTasks(res.data);
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  async function createTask() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showToast('error', 'Task title is required');
      return;
    }

    if (trimmedTitle.length > 100) {
      showToast('error', 'Title must be less than 100 characters');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/tasks', { title: trimmedTitle });
      setTitle('');
      showToast('success', 'Task created successfully');
      await fetchTasks();
    } catch (error) {
      showToast('error', 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTask(id: string) {
    try {
      await api.delete(`/tasks/${id}`);
      showToast('success', 'Task deleted');
      await fetchTasks();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    }
  }

  async function toggleStatus(task: Task) {
    try {
      await api.patch(`/tasks/${task.id}`, {
        status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
      });
      await fetchTasks();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main className="dashboard">
      {toast && (
        <div className={`toast ${toast.type}`} role="alert">
          <span>{toast.type === 'error' ? '✕' : '✓'}</span>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <p>Organize your work and stay productive</p>
      </header>

      <section className="stats">
        <article className="stat-card">
          <span>Total Tasks</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </article>
        <article className="stat-card">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Create Task</h2>
        <form
          className="create-form"
          onSubmit={(event) => {
            event.preventDefault();
            void createTask();
          }}
        >
          <input
            placeholder="Enter a new task..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Add Task'}
          </button>
        </form>
      </section>

      <section className="task-list">
        {loading && <p className="loading-state">Loading tasks...</p>}

        {!loading && tasks.length === 0 && (
          <p className="empty-state">No tasks yet. Add your first task above.</p>
        )}

        {tasks.map((task) => (
          <article key={task.id} className="task-card">
            <h3>{task.title}</h3>
            {task.description !== task.title && <p>{task.description}</p>}
            <div className="task-meta">
              <span
                className={`status-badge ${
                  task.status === 'COMPLETED' ? 'completed' : 'pending'
                }`}
              >
                {task.status}
              </span>
              <div className="task-actions">
                <button type="button" onClick={() => toggleStatus(task)}>
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

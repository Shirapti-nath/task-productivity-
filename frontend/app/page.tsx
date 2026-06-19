'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
}

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

  return 'Something went wrong. Check that the API is running.';
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<Task[]>('/tasks');
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  async function createTask() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      await api.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      setError('');
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function deleteTask(id: string) {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function toggleStatus(task: Task) {
    try {
      await api.patch(`/tasks/${task.id}`, {
        status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
      });
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
      <h1>Task Productivity</h1>
      <p>Manage your day-to-day tasks</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Create Task</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <button type="button" onClick={createTask}>
          Create Task
        </button>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
        )}
      </section>

      <section>
        <h2>Your Tasks</h2>

        {loading && <p>Loading tasks...</p>}

        {!loading && tasks.length === 0 && <p>No tasks yet. Create one above.</p>}

        {tasks.map((task) => (
          <article
            key={task.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              background: '#fff',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{task.title}</h3>
            <p>{task.description}</p>
            <strong>{task.status}</strong>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => deleteTask(task.id)}>
                Delete
              </button>

              <button type="button" onClick={() => toggleStatus(task)}>
                Toggle Status
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

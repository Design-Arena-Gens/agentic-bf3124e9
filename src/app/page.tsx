'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "simple-todo-app:v1";

function loadTodosFromStorage(): Todo[] {
  if (typeof window === "undefined") {
    return [];
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored) as Todo[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.completed === "boolean" &&
          typeof item.createdAt === "string",
      )
      .map((item) => ({
        ...item,
        title: item.title.trim(),
      }));
  } catch (error) {
    console.error("Failed to parse stored todos", error);
    return [];
  }
}

function persistTodos(todos: Todo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodo(title: string): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const stored = loadTodosFromStorage();
    if (stored.length === 0) return;
    requestAnimationFrame(() => setTodos(stored));
  }, []);

  useEffect(() => {
    persistTodos(todos);
  }, [todos]);

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newTodo.trim();
    if (!trimmed) return;
    setTodos((previous) => [...previous, createTodo(trimmed)]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: string) => {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((previous) => previous.filter((todo) => !todo.completed));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-3 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            Todo
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Plan your day, one task at a time.
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Capture new ideas, check things off, and stay focused with a
            lightweight task manager that saves to your browser.
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 ring-1 ring-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none dark:ring-zinc-800/80">
          <form
            onSubmit={handleAddTodo}
            className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-6 dark:border-zinc-800 sm:flex-row sm:items-center"
          >
            <div className="flex grow items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2.5 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-within:border-violet-400 dark:focus-within:ring-violet-500/30">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-xs font-semibold text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                {todos.length + 1}
              </div>
              <input
                type="text"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                placeholder="What needs to get done?"
                className="w-full bg-transparent text-base text-zinc-800 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                aria-label="Add a new task"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:bg-violet-500 dark:hover:bg-violet-400 dark:focus-visible:ring-offset-zinc-900"
            >
              Add Task
            </button>
          </form>

          <div className="flex flex-col gap-4 px-6 py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {remainingCount === 0 ? (
                  <span>Everything&apos;s done — nice work!</span>
                ) : (
                  <span>{remainingCount} task(s) left</span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <FilterButton
                  label="All"
                  isActive={filter === "all"}
                  onClick={() => setFilter("all")}
                />
                <FilterButton
                  label="Active"
                  isActive={filter === "active"}
                  onClick={() => setFilter("active")}
                />
                <FilterButton
                  label="Completed"
                  isActive={filter === "completed"}
                  onClick={() => setFilter("completed")}
                />
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="rounded-full border border-transparent px-3 py-1 text-xs font-medium text-zinc-500 transition hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  Clear completed
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {filteredTodos.length === 0 && (
                <li className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  {todos.length === 0
                    ? "Start by adding your first task above."
                    : "Nothing to see here. Try another filter."}
                </li>
              )}

              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <button
                    type="button"
                    onClick={() => toggleTodo(todo.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 transition group-hover:border-violet-400 dark:border-zinc-700 dark:group-hover:border-violet-300"
                    aria-pressed={todo.completed}
                    aria-label={`Mark "${todo.title}" as ${
                      todo.completed ? "incomplete" : "complete"
                    }`}
                  >
                    {todo.completed && (
                      <span className="text-sm text-violet-600 dark:text-violet-400">
                        ✓
                      </span>
                    )}
                  </button>
                  <div className="flex grow flex-col">
                    <span
                      className={`text-sm font-medium ${
                        todo.completed
                          ? "text-zinc-400 line-through dark:text-zinc-500"
                          : "text-zinc-800 dark:text-zinc-100"
                      }`}
                    >
                      {todo.title}
                    </span>
                    <time
                      className="text-xs text-zinc-400 dark:text-zinc-500"
                      dateTime={todo.createdAt}
                    >
                      Added{" "}
                      {new Date(todo.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTodo(todo.id)}
                    className="invisible rounded-full px-3 py-1 text-xs font-medium text-zinc-400 transition group-hover:visible hover:bg-zinc-100 hover:text-red-500 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                    aria-label={`Delete "${todo.title}"`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

type FilterButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        isActive
          ? "border-violet-500 bg-violet-500 text-white shadow-sm shadow-violet-500/30 dark:border-violet-400 dark:bg-violet-500"
          : "border-transparent bg-zinc-100 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
      }`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

import React, { useEffect, useRef, useState } from "react";
import type { ITODO } from "../types/todo";

type Props = {
  initialValues?: Partial<ITODO>;
  onSubmit: (values: Omit<ITODO, "id">) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

function formatForInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function TodoForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: Props) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [deadline, setDeadline] = useState<string>(
    formatForInput(initialValues?.deadline)
  );
  const [priority, setPriority] = useState<number>(
    initialValues?.priority ?? 1
  );
  const [completed, setCompleted] = useState<boolean>(
    initialValues?.completed ?? false
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const payload: Omit<ITODO, "id"> = {
      name: name.trim(),
      description: description.trim() || "",
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      completed,
      priority: Number(priority) || 1,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      onCancel?.();
    } catch (err: any) {
      setError(err?.message || "Failed to save todo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Name</div>
          <input
            ref={firstInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Task title"
            className="input"
            aria-required
          />
        </label>

        <label>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="input"
            rows={3}
          />
        </label>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <label style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Deadline</div>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input"
            />
          </label>

          <label style={{ width: 120 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Priority</div>
            <select
              value={String(priority)}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="input"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span style={{ fontSize: 12 }}>Completed</span>
          </label>
        </div>

        {error && (
          <div role="alert" style={{ color: "#b91c1c", fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
            aria-disabled={submitting}
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

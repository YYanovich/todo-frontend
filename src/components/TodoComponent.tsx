import type { ITODO } from "../types/todo";

type Props = {
  todo: ITODO;
  onEdit?: (todo: ITODO) => void;
};

export default function TodoComponent({ todo, onEdit }: Props) {
    return (
        <article className="todo-card">
      <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: 12,
        }}
        >
        <div style={{ flex: 1 }}>
          <h3 className="todo-title">{todo.name}</h3>
          {todo.description && <p className="todo-desc">{todo.description}</p>}
          <p className="todo-meta">
            Status: {todo.completed ? "Done" : "In progress"} — Priority:{" "}
            {todo.priority}
          </p>
         
          {todo.deadline && (
              <p className="todo-deadline">
              Due: {new Date(todo.deadline).toLocaleString()}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            type="button"
            className="btn"
            onClick={() => onEdit?.(todo)}
            aria-label={`Edit ${todo.name}`}
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

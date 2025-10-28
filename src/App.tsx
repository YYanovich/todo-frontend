import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos, setPage } from "./store/todoSlice";
import TodoComponent from "./components/TodoComponent";
import TodoModal from "./Modal/TodoModal";
import type { AppDispatch, RootState } from "./store";
import type { ITODO } from "./types/todo";
import "./App.scss";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTodos({ page: 1, limit: 10 }));
  }, [dispatch]);

  const { todos, loading, error, page, totalPages, limit } = useSelector(
    (state: RootState) => state.todos
  );
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITODO | null>(null);
  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading the list of tasks...</p>;

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <div>
            <div className="app-title">My TODOs</div>
            <div className="app-subtitle">
              Manage your tasks — quick and simple
            </div>
          </div>

          <div>
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => setOpenAdd(true)}
            >
              + Add Todo
            </button>
            <TodoModal
              open={openAdd}
              onClose={() => setOpenAdd(false)}
              mode="add"
            />
            <TodoModal
              open={openEdit}
              onClose={() => {
                setOpenEdit(false);
                setEditingTodo(null);
              }}
              mode="edit"
              initialValues={editingTodo ?? undefined}
            />
          </div>
        </header>

        <section className="main-card">
          <div className="todo-list">
            {todos && todos.length > 0 ? (
              todos.map((todo: ITODO) => (
                <TodoComponent
                  key={todo.id}
                  todo={todo}
                  onEdit={(t) => {
                    setEditingTodo(t);
                    setOpenEdit(true);
                  }}
                />
              ))
            ) : (
              <p className="muted">Your todo list is empty</p>
            )}
          </div>

          <div
            className="pagination"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              marginTop: 18,
            }}
          >
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => {
                const prev = Math.max(1, page - 1);
                if (prev !== page) {
                  dispatch(setPage(prev));
                  dispatch(fetchTodos({ page: prev, limit }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={page <= 1}
            >
              ← Prev
            </button>

            <div style={{ fontSize: 14, color: "#333" }}>
              Page {page} of {totalPages}
            </div>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => {
                const next = Math.min(totalPages || 1, page + 1);
                if (next !== page) {
                  dispatch(setPage(next));
                  dispatch(fetchTodos({ page: next, limit }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={page >= (totalPages || 1)}
            >
              Next →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

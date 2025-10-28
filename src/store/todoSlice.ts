import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ITODO } from "../types/todo";
import axios from "axios";

type TodoState = {
  todos: ITODO[];
  page: number;
  totalPages: number;
  totalTodo: number;
  limit: number;
  loading: boolean;
  error: string | null;
};

const initialState: TodoState = {
  todos: [],
  page: 1,
  totalPages: 1,
  totalTodo: 0,
  limit: 10,
  loading: false,
  error: null,
};

// Use Vite env variable for API base (set VITE_API_URL in deployment), fallback to localhost for local dev
const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5003";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axios.get(`${API_BASE}/api/todos`, {
      params: { page, limit },
    });
    return response.data;
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (newTodo: Omit<ITODO, "id">) => {
    const response = await axios.post(`${API_BASE}/api/todos`, newTodo);
    return response.data;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo: ITODO) => {
    const response = await axios.patch(
      `${API_BASE}/api/todos/${updatedTodo.id}`,
      updatedTodo
    );
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string) => {
    await axios.delete(`${API_BASE}/api/todos/${id}`);
    return id;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const raw = action.payload.todo || [];
        state.todos = raw.map((t: any) => ({
          ...(t as any),
          id: (t as any).id ?? (t as any)._id,
        }));
        state.totalPages = action.payload.totalPages;
        state.totalTodo = action.payload.totalTodo;
        state.page = action.payload.page;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      })
      // addTodo
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const t = action.payload as any;
        const normalized = { ...t, id: t.id ?? t._id } as ITODO;
        state.todos.unshift(normalized);
        state.totalTodo += 1;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      })
      // updateTodo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const payload = action.payload as any;
        const payloadId = payload.id ?? payload._id;
        const idx = state.todos.findIndex((todo) => todo.id === payloadId);
        if (idx !== -1) {
          state.todos[idx] = { ...(payload as any), id: payloadId } as ITODO;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      })
      // deleteTodo
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        state.totalTodo -= 1;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

export const { setPage } = todoSlice.actions;
export default todoSlice.reducer;

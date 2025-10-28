import { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import type { ITODO } from "../types/todo";
import TodoForm from "../components/TodoForm";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { addTodo, updateTodo } from "../store/todoSlice";
import { unwrapResult } from "@reduxjs/toolkit";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<ITODO>;
  mode?: "add" | "edit";
};

export default function TodoModal({
  open,
  onClose,
  initialValues,
  mode = "add",
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(values: Omit<ITODO, "id">) {
    setSubmitError(null);
    try {
      if (mode === "add") {
        const res = await dispatch(addTodo(values));
        unwrapResult(res);
      } else {
        if (!initialValues?.id) throw new Error("Missing id for update");
        const payload = { ...values, id: initialValues.id } as ITODO;
        const res = await dispatch(updateTodo(payload));
        unwrapResult(res);
      }
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save");
      throw err;
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Add Todo" : "Edit Todo"}</DialogTitle>
      <DialogContent>
        <TodoForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={mode === "add" ? "Create" : "Save"}
        />
        {submitError && (
          <div style={{ color: "#b91c1c", marginTop: 8 }}>{submitError}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

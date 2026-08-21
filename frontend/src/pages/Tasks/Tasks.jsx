import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import api from "../../api";

import Page from "../../components/ui/Page/Page";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";

import { field, select } from "../../components/forms/renderers/renderers";
import { fmtDate } from "../../utils/formatters";

function Tasks() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const empty = {
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  };

  const [form, setForm] = useState(empty);

  // =========================
  // LOAD TASKS
  // =========================
  const load = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks");

      setItems(response.data?.tasks || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPORTANT
  // Never use: useEffect(load, [])
  useEffect(() => {
    load();
  }, []);

  // =========================
  // ADD / UPDATE TASK
  // =========================
  const save = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`/tasks/${editing._id}`, form);
      } else {
        await api.post("/tasks", form);
      }

      setShow(false);
      setEditing(null);
      setForm(empty);

      await load();
    } catch (error) {
      console.error("Failed to save task:", error);

      alert(
        error?.response?.data?.message ||
          "Task save nahi ho paayi."
      );
    }
  };

  // =========================
  // DELETE TASK
  // =========================
  const del = async (id) => {
    const confirmed = window.confirm("Delete task?");

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${id}`);

      await load();
    } catch (error) {
      console.error("Failed to delete task:", error);

      alert(
        error?.response?.data?.message ||
          "Task delete nahi ho paayi."
      );
    }
  };

  // =========================
  // COMPLETE / PENDING
  // =========================
  const toggleStatus = async (task) => {
    try {
      const newStatus =
        task.status === "Completed"
          ? "Pending"
          : "Completed";

      await api.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      await load();
    } catch (error) {
      console.error("Failed to update task status:", error);

      alert(
        error?.response?.data?.message ||
          "Task status update nahi ho paya."
      );
    }
  };

  // =========================
  // ADD TASK
  // =========================
  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };

  // =========================
  // EDIT TASK
  // =========================
  const openEdit = (task) => {
    setEditing(task);

    setForm({
      ...empty,
      ...task,
      dueDate: task.dueDate
        ? task.dueDate.slice(0, 10)
        : "",
    });

    setShow(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setShow(false);
    setEditing(null);
    setForm(empty);
  };

  return (
    <Page
      title="Tasks"
      subtitle="Stay on top of follow-ups and team actions."
      action={
        <button
          className="primary"
          onClick={openAdd}
        >
          <Plus size={16} />
          Add Task
        </button>
      }
    >
      {/* =========================
          TASK LIST
      ========================= */}

      {loading ? (
        <div className="empty-state">
          Loading tasks...
        </div>
      ) : (
        <div className="task-list">
          {items.map((task) => (
            <div
              className="task-item"
              key={task._id}
            >
              {/* COMPLETE BUTTON */}
              <button
                className={
                  task.status === "Completed"
                    ? "check done"
                    : "check"
                }
                onClick={() => toggleStatus(task)}
                title={
                  task.status === "Completed"
                    ? "Mark as Pending"
                    : "Mark as Completed"
                }
              >
                ✓
              </button>

              {/* TASK DETAILS */}
              <div>
                <b>{task.title}</b>

                <small>
                  {task.dueDate
                    ? fmtDate(task.dueDate)
                    : "No due date"}
                  {" · "}
                  {task.priority || "Medium"}
                  {" · "}
                  {task.assignedTo?.name ||
                    "Unassigned"}
                </small>

                {task.description && (
                  <small>
                    {task.description}
                  </small>
                )}
              </div>

              {/* STATUS */}
              <Badge
                text={task.status || "Pending"}
              />

              {/* EDIT */}
              <button
                className="table-btn"
                onClick={() => openEdit(task)}
                title="Edit Task"
              >
                <Edit3 size={15} />
              </button>

              {/* DELETE */}
              <button
                className="table-btn danger"
                onClick={() => del(task._id)}
                title="Delete Task"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {!items.length && !loading && (
            <Empty text="No tasks. Create your first task." />
          )}
        </div>
      )}

      {/* =========================
          TASK MODAL
      ========================= */}

      {show && (
        <Modal
          title={
            editing
              ? "Edit Task"
              : "Add Task"
          }
          close={closeModal}
        >
          <form
            onSubmit={save}
            className="form-grid"
          >
            {field(
              "Task Title",
              "title",
              form,
              setForm,
              true
            )}

            {field(
              "Description",
              "description",
              form,
              setForm
            )}

            {field(
              "Due Date",
              "dueDate",
              form,
              setForm,
              false,
              "date"
            )}

            {select(
              "Priority",
              "priority",
              [
                "Low",
                "Medium",
                "High",
              ],
              form,
              setForm
            )}

            {select(
              "Status",
              "status",
              [
                "Pending",
                "In Progress",
                "Completed",
              ],
              form,
              setForm
            )}

            <button
              type="submit"
              className="primary full form-submit"
            >
              {editing
                ? "Update Task"
                : "Save Task"}
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

export default Tasks;
import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import api from "../../api";

import Page from "../../components/ui/Page/Page";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";

import { field, select } from "../../components/forms/renderers/renderers";
import { fmtDate } from "../../utils/formatters";

function UsersRoles() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const empty = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "agent",
  };

  const [form, setForm] = useState(empty);

  // =========================
  // CURRENT USER
  // =========================

  const user = JSON.parse(
    localStorage.getItem("estate_user") || "null"
  );

  const isAdmin = user?.role === "admin";

  // =========================
  // LOAD USERS
  // =========================

  const load = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setItems(response.data?.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);

      setItems([]);

      alert(
        error?.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPORTANT
  useEffect(() => {
    load();
  }, []);

  // =========================
  // ADD / UPDATE USER
  // =========================

  const save = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...form,
      };

      // Edit ke time empty password backend ko mat bhejo
      if (editing && !body.password) {
        delete body.password;
      }

      if (editing) {
        await api.put(
          `/users/${editing._id}`,
          body
        );
      } else {
        await api.post("/users", body);
      }

      closeModal();

      await load();
    } catch (error) {
      console.error("Unable to save user:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to save user"
      );
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const del = async (id) => {
    if (id === user?.id) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this user?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);

      await load();
    } catch (error) {
      console.error("Unable to delete user:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete user"
      );
    }
  };

  // =========================
  // ADD USER
  // =========================

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };

  // =========================
  // EDIT USER
  // =========================

  const openEdit = (u) => {
    setEditing(u);

    setForm({
      name: u.name || "",
      email: u.email || "",
      password: "",
      phone: u.phone || "",
      role: u.role || "agent",
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
      title="Users & Roles"
      subtitle="Control your team access and responsibilities."
      action={
        isAdmin ? (
          <button
            className="primary"
            onClick={openAdd}
          >
            <Plus size={16} />
            Add User
          </button>
        ) : null
      }
    >
      {/* =========================
          USERS TABLE
      ========================= */}

      <div className="table-card">
        {loading ? (
          <div className="empty-state">
            Loading users...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((u) => (
                <tr key={u._id}>
                  <td>
                    <b>{u.name}</b>
                  </td>

                  <td>{u.email}</td>

                  <td>
                    {u.phone || "—"}
                  </td>

                  <td>
                    <Badge text={u.role} />
                  </td>

                  <td>
                    {u.createdAt
                      ? fmtDate(u.createdAt)
                      : "—"}
                  </td>

                  <td>
                    {isAdmin && (
                      <>
                        {/* EDIT */}
                        <button
                          className="table-btn"
                          onClick={() =>
                            openEdit(u)
                          }
                          title="Edit User"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* DELETE */}
                        {u._id !== user?.id && (
                          <button
                            className="table-btn danger"
                            onClick={() =>
                              del(u._id)
                            }
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan="6">
                    <Empty text="No users found." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* =========================
          USER MODAL
      ========================= */}

      {show && (
        <Modal
          title={
            editing
              ? "Edit User"
              : "Add User"
          }
          close={closeModal}
        >
          <form
            onSubmit={save}
            className="form-grid"
          >
            {field(
              "Name",
              "name",
              form,
              setForm,
              true
            )}

            {field(
              "Email",
              "email",
              form,
              setForm,
              true,
              "email"
            )}

            {field(
              editing
                ? "New Password (optional)"
                : "Password",
              "password",
              form,
              setForm,
              !editing,
              "password"
            )}

            {field(
              "Phone",
              "phone",
              form,
              setForm
            )}

            {select(
              "Role",
              "role",
              [
                "agent",
                "manager",
                "admin",
              ],
              form,
              setForm
            )}

            <button
              type="submit"
              className="primary full form-submit"
            >
              {editing
                ? "Update User"
                : "Save User"}
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

export default UsersRoles;
import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import api from "../../api";

import Page from "../../components/ui/Page/Page";
import Toolbar from "../../components/ui/Toolbar/Toolbar";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";

import {
  field,
  select,
} from "../../components/forms/renderers/renderers";

function Contacts() {
  // =========================
  // STATE
  // =========================

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const empty = {
    name: "",
    phone: "",
    email: "",
    company: "",
    source: "Website",
    budget: "",
    location: "",
    propertyInterest: "",
    status: "New",
    notes: "",
  };

  const [form, setForm] = useState(empty);

  // =========================
  // LOAD CONTACTS
  // =========================

  const load = async () => {
    try {
      const response = await api.get(
        `/contacts?search=${encodeURIComponent(search)}`
      );

      setItems(response.data?.items || []);
    } catch (error) {
      console.error("Contacts API Error:", error);
      setItems([]);
    }
  };

  // IMPORTANT:
  // load ko directly useEffect me pass nahi karna
  useEffect(() => {
    load();
  }, []);

  // =========================
  // ADD / UPDATE CONTACT
  // =========================

  const save = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...form,
        budget: Number(form.budget) || 0,
      };

      if (editing) {
        await api.put(`/contacts/${editing._id}`, body);
      } else {
        await api.post("/contacts", body);
      }

      setShow(false);
      setEditing(null);
      setForm(empty);

      await load();
    } catch (error) {
      console.error("Save Contact Error:", error);
    }
  };

  // =========================
  // DELETE CONTACT
  // =========================

  const del = async (id) => {
    const confirmed = window.confirm("Delete contact?");

    if (!confirmed) return;

    try {
      await api.delete(`/contacts/${id}`);

      await load();
    } catch (error) {
      console.error("Delete Contact Error:", error);
    }
  };

  // =========================
  // OPEN ADD CONTACT
  // =========================

  const openAddContact = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };

  // =========================
  // OPEN EDIT CONTACT
  // =========================

  const openEditContact = (contact) => {
    setEditing(contact);

    setForm({
      ...empty,
      ...contact,
      budget: contact.budget || "",
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

  // =========================
  // UI
  // =========================

  return (
    <Page
      title="Contacts"
      subtitle="Central customer directory with relationship history."
      action={
        <button className="primary" onClick={openAddContact}>
          <Plus size={16} />
          Add Contact
        </button>
      }
    >
      {/* SEARCH */}

      <Toolbar
        search={search}
        setSearch={setSearch}
        onSearch={load}
      />

      {/* CONTACTS TABLE */}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Interest</th>
              <th>Budget</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((contact) => (
              <tr key={contact._id}>
                <td>
                  <b>{contact.name}</b>

                  <small>
                    {contact.email || "No email"}
                  </small>
                </td>

                <td>{contact.phone}</td>

                <td>
                  {contact.location || "—"}
                </td>

                <td>
                  {contact.propertyInterest || "—"}
                </td>

                <td>
                  {contact.budget
                    ? `₹${(
                        contact.budget / 100000
                      ).toFixed(1)}L`
                    : "—"}
                </td>

                <td>
                  <Badge text={contact.status} />
                </td>

                <td>
                  {/* EDIT */}

                  <button
                    className="table-btn"
                    onClick={() =>
                      openEditContact(contact)
                    }
                    title="Edit Contact"
                  >
                    <Edit3 size={15} />
                  </button>

                  {/* DELETE */}

                  <button
                    className="table-btn danger"
                    onClick={() =>
                      del(contact._id)
                    }
                    title="Delete Contact"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr>
                <td colSpan="7">
                  <Empty text="No contacts yet. Add your first contact." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}

      {show && (
        <Modal
          title={
            editing
              ? "Edit Contact"
              : "Add Contact"
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
              "Phone",
              "phone",
              form,
              setForm,
              true
            )}

            {field(
              "Email",
              "email",
              form,
              setForm
            )}

            {field(
              "Company",
              "company",
              form,
              setForm
            )}

            {field(
              "Budget (₹)",
              "budget",
              form,
              setForm,
              false,
              "number"
            )}

            {field(
              "Location",
              "location",
              form,
              setForm
            )}

            {field(
              "Property Interest",
              "propertyInterest",
              form,
              setForm
            )}

            {select(
              "Source",
              "source",
              [
                "Website",
                "Facebook",
                "Instagram",
                "Referral",
                "Walk-in",
                "Other",
              ],
              form,
              setForm
            )}

            {select(
              "Status",
              "status",
              [
                "New",
                "Contacted",
                "Qualified",
                "Active",
                "Inactive",
              ],
              form,
              setForm
            )}

            {field(
              "Notes",
              "notes",
              form,
              setForm
            )}

            <button
              type="submit"
              className="primary full form-submit"
            >
              {editing
                ? "Update Contact"
                : "Save Contact"}
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

export default Contacts;
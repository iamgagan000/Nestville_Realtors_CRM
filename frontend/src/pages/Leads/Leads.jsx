import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import api from "../../api";

import Page from "../../components/ui/Page/Page";
import Toolbar from "../../components/ui/Toolbar/Toolbar";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";

import LeadForm from "./LeadForm";

function Leads() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const empty = {
    name: "",
    phone: "",
    email: "",
    source: "Website",
    budget: "",
    location: "",
    propertyType: "Apartment",
    status: "New",
    priority: "Medium",
    notes: "",
  };

  const [form, setForm] = useState(empty);

  // =========================
  // LOAD LEADS
  // =========================
  const load = async () => {
    try {
      const response = await api.get(
        `/leads?search=${encodeURIComponent(search)}`
      );

      setItems(response.data?.leads || []);
    } catch (error) {
      console.error("Leads API Error:", error);
      setItems([]);
    }
  };

  // IMPORTANT:
  // Function ko directly useEffect me pass nahi karna hai
  useEffect(() => {
    load();
  }, []);

  // =========================
  // SAVE / UPDATE LEAD
  // =========================
  const save = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...form,
        budget: Number(form.budget) || 0,
      };

      if (editing) {
        await api.put(`/leads/${editing._id}`, body);
      } else {
        await api.post("/leads", body);
      }

      setShow(false);
      setEditing(null);
      setForm(empty);

      await load();
    } catch (error) {
      console.error("Save Lead Error:", error);
    }
  };

  // =========================
  // DELETE LEAD
  // =========================
  const del = async (id) => {
    const confirmed = window.confirm("Delete this lead?");

    if (!confirmed) return;

    try {
      await api.delete(`/leads/${id}`);

      await load();
    } catch (error) {
      console.error("Delete Lead Error:", error);
    }
  };

  // =========================
  // EDIT LEAD
  // =========================
  const edit = (lead) => {
    setEditing(lead);

    setForm({
      ...empty,
      ...lead,
      budget: lead.budget || "",
    });

    setShow(true);
  };

  // =========================
  // ADD NEW LEAD
  // =========================
  const openAddLead = () => {
    setEditing(null);
    setForm(empty);
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
      title="Leads"
      subtitle="Capture, qualify and convert every opportunity."
      action={
        <button className="primary" onClick={openAddLead}>
          <Plus size={16} />
          Add Lead
        </button>
      }
    >
      {/* =========================
          SEARCH TOOLBAR
      ========================= */}
      <Toolbar
        search={search}
        setSearch={setSearch}
        onSearch={load}
      />

      {/* =========================
          LEADS TABLE
      ========================= */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Lead</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Priority</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <b>{lead.name}</b>
                  <small>{lead.email || "No email"}</small>
                </td>

                <td>{lead.phone}</td>

                <td>{lead.source}</td>

                <td>{lead.location || "—"}</td>

                <td>
                  {lead.budget
                    ? `₹${(lead.budget / 100000).toFixed(1)}L`
                    : "—"}
                </td>

                <td>
                  <Badge text={lead.status} />
                </td>

                <td>
                  <Badge text={lead.priority} />
                </td>

                <td>
                  <button
                    className="table-btn"
                    onClick={() => edit(lead)}
                    title="Edit Lead"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    className="table-btn danger"
                    onClick={() => del(lead._id)}
                    title="Delete Lead"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr>
                <td colSpan="8">
                  <Empty text="No leads yet. Add your first lead." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================
          ADD / EDIT LEAD MODAL
      ========================= */}
      {show && (
        <Modal
          title={editing ? "Edit Lead" : "Add New Lead"}
          close={closeModal}
        >
          <LeadForm
            form={form}
            setForm={setForm}
            onSubmit={save}
          />
        </Modal>
      )}
    </Page>
  );
}

export default Leads;
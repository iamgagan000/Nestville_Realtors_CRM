import React, { useEffect, useState } from "react";
import { Building2, Edit3, Plus, Trash2 } from "lucide-react";

import api from "../../api";

import Page from "../../components/ui/Page/Page";
import Toolbar from "../../components/ui/Toolbar/Toolbar";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";

import { field, select } from "../../components/forms/renderers/renderers";

function Properties() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const empty = {
    title: "",
    project: "",
    location: "",
    type: "Apartment",
    bhk: "2 BHK",
    minPrice: "",
    maxPrice: "",
    status: "Available",
    image: "",
    description: "",
    amenities: "",
  };

  const [form, setForm] = useState(empty);

  // ✅ IMPORTANT: load itself does NOT get passed directly to useEffect
  const load = async () => {
    try {
      setLoading(true);

      const response = await api.get("/properties");

      setItems(response.data?.properties || []);
    } catch (error) {
      console.error("Failed to load properties:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Correct useEffect
  useEffect(() => {
    load();
  }, []);

  // =========================
  // SAVE PROPERTY
  // =========================
  const save = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...form,
        minPrice: Number(form.minPrice) || 0,
        maxPrice: Number(form.maxPrice) || 0,
        amenities: form.amenities
          ? form.amenities
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : [],
      };

      if (editing) {
        await api.put(`/properties/${editing._id}`, body);
      } else {
        await api.post("/properties", body);
      }

      setShow(false);
      setEditing(null);
      setForm(empty);

      await load();
    } catch (error) {
      console.error("Failed to save property:", error);

      alert(
        error?.response?.data?.message ||
          "Property save nahi ho paayi."
      );
    }
  };

  // =========================
  // DELETE PROPERTY
  // =========================
  const del = async (id) => {
    const confirmed = window.confirm("Delete property?");

    if (!confirmed) return;

    try {
      await api.delete(`/properties/${id}`);

      await load();
    } catch (error) {
      console.error("Failed to delete property:", error);

      alert(
        error?.response?.data?.message ||
          "Property delete nahi ho paayi."
      );
    }
  };

  // =========================
  // ADD PROPERTY
  // =========================
  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };

  // =========================
  // EDIT PROPERTY
  // =========================
  const openEdit = (property) => {
    setEditing(property);

    setForm({
      ...empty,
      ...property,
      amenities: Array.isArray(property.amenities)
        ? property.amenities.join(", ")
        : property.amenities || "",
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
      title="Properties"
      subtitle="Projects, inventory and property availability."
      action={
        <button className="primary" onClick={openAdd}>
          <Plus size={16} />
          Add Property
        </button>
      }
    >
      <Toolbar
        search=""
        setSearch={() => {}}
        onSearch={load}
      />

      {/* =========================
          PROPERTY GRID
      ========================= */}

      {loading ? (
        <div className="empty-state">
          Loading properties...
        </div>
      ) : (
        <div className="property-grid">
          {items.map((p) => (
            <div className="property-card" key={p._id}>
              {/* IMAGE */}
              <div className="property-image">
                {p.image ? (
                  <img src={p.image} alt={p.title || "Property"} />
                ) : (
                  <Building2 size={40} />
                )}
              </div>

              {/* BODY */}
              <div className="property-body">
                <div className="row-between">
                  <h3>{p.title || "Untitled Property"}</h3>

                  <Badge text={p.status || "Available"} />
                </div>

                <p>
                  {p.project || "Premium Project"}
                  {" • "}
                  {p.location || "Location not available"}
                </p>

                <b>
                  {p.bhk || "Apartment"} · ₹
                  {((p.minPrice || 0) / 10000000).toFixed(2)}
                  Cr – ₹
                  {((p.maxPrice || 0) / 10000000).toFixed(2)}
                  Cr
                </b>

                {/* ACTIONS */}
                <div className="card-actions">
                  <button onClick={() => openEdit(p)}>
                    <Edit3 size={15} />
                    Edit
                  </button>

                  <button
                    className="danger-text"
                    onClick={() => del(p._id)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!items.length && !loading && (
            <Empty text="No properties yet. Add a project to get started." />
          )}
        </div>
      )}

      {/* =========================
          PROPERTY MODAL
      ========================= */}

      {show && (
        <Modal
          title={editing ? "Edit Property" : "Add Property"}
          close={closeModal}
          wide
        >
          <form onSubmit={save} className="form-grid">
            {field(
              "Property Name",
              "title",
              form,
              setForm,
              true
            )}

            {field(
              "Project",
              "project",
              form,
              setForm
            )}

            {field(
              "Location",
              "location",
              form,
              setForm,
              true
            )}

            {field(
              "BHK",
              "bhk",
              form,
              setForm
            )}

            {field(
              "Min Price (₹)",
              "minPrice",
              form,
              setForm,
              false,
              "number"
            )}

            {field(
              "Max Price (₹)",
              "maxPrice",
              form,
              setForm,
              false,
              "number"
            )}

            {select(
              "Status",
              "status",
              ["Available", "Sold", "Hold"],
              form,
              setForm
            )}

            {field(
              "Image URL",
              "image",
              form,
              setForm
            )}

            {field(
              "Amenities (comma separated)",
              "amenities",
              form,
              setForm
            )}

            {field(
              "Description",
              "description",
              form,
              setForm
            )}

            <button
              type="submit"
              className="primary full form-submit"
            >
              {editing ? "Update Property" : "Save Property"}
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

export default Properties;
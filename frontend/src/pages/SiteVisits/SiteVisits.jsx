import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import api from "../../api";

import Page from "../../components/ui/Page/Page";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";

import {
  field,
  select,
} from "../../components/forms/renderers/renderers";

import { fmtDate } from "../../utils/formatters";

function SiteVisits() {
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const empty = {
    contact: "",
    lead: "",
    property: "",
    visitDate: "",
    status: "Scheduled",
    visitors: 1,
    feedback: "",
    notes: "",
  };

  const [form, setForm] = useState(empty);

  // ==========================================
  // LOAD SITE VISITS
  // ==========================================

  const load = async () => {
    try {
      setLoading(true);

      const response = await api.get("/site-visits");

      setItems(response.data?.items || []);
    } catch (error) {
      console.error(
        "Site Visits API Error:",
        error
      );

      setItems([]);

      alert(
        error?.response?.data?.message ||
          "Unable to load site visits."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CONTACTS & PROPERTIES
  // ==========================================

  const loadFormData = async () => {
    try {
      const [
        contactsResponse,
        propertiesResponse,
      ] = await Promise.all([
        api.get("/contacts"),
        api.get("/properties"),
      ]);

      setContacts(
        contactsResponse.data?.items || []
      );

      setProperties(
        propertiesResponse.data?.properties ||
          propertiesResponse.data?.items ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to load form data:",
        error
      );
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    load();
    loadFormData();
  }, []);

  // ==========================================
  // SAVE SITE VISIT
  // ==========================================

  const save = async (e) => {
    e.preventDefault();

    // Property is required
    if (!form.property) {
      alert("Please select a property.");
      return;
    }

    // Visit date is required
    if (!form.visitDate) {
      alert(
        "Please select visit date and time."
      );
      return;
    }

    try {
      const body = {
        ...form,

        // Empty optional references should not be
        // sent as empty strings.
        contact: form.contact || undefined,

        lead: form.lead || undefined,

        // Property is required.
        property: form.property,

        visitors:
          Number(form.visitors) || 1,
      };

      if (editing) {
        await api.put(
          `/site-visits/${editing._id}`,
          body
        );
      } else {
        await api.post(
          "/site-visits",
          body
        );
      }

      closeModal();

      await load();
    } catch (error) {
      console.error(
        "Save Site Visit Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to save site visit."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const del = async (id) => {
    const confirmed = window.confirm(
      "Delete site visit?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/site-visits/${id}`
      );

      await load();
    } catch (error) {
      console.error(
        "Delete Site Visit Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to delete site visit."
      );
    }
  };

  // ==========================================
  // OPEN ADD
  // ==========================================

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const openEdit = (visit) => {
    setEditing(visit);

    setForm({
      ...empty,

      ...visit,

      contact:
        visit.contact?._id ||
        visit.contact ||
        "",

      lead:
        visit.lead?._id ||
        visit.lead ||
        "",

      property:
        visit.property?._id ||
        visit.property ||
        "",

      visitDate: visit.visitDate
        ? visit.visitDate.slice(0, 16)
        : "",

      visitors:
        visit.visitors || 1,
    });

    setShow(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShow(false);
    setEditing(null);
    setForm(empty);
  };

  return (
    <Page
      title="Site Visits"
      subtitle="Schedule visits, track attendance and capture feedback."
      action={
        <button
          className="primary"
          onClick={openAdd}
        >
          <Plus size={16} />
          Schedule Visit
        </button>
      }
    >
      {/* ======================================
          SITE VISITS TABLE
      ====================================== */}

      <div className="table-card">
        {loading ? (
          <div className="empty-state">
            Loading site visits...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Property</th>
                <th>Visit Date</th>
                <th>Visitors</th>
                <th>Status</th>
                <th>Feedback</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((visit) => (
                <tr key={visit._id}>
                  {/* CUSTOMER */}

                  <td>
                    <b>
                      {visit.contact?.name ||
                        visit.lead?.name ||
                        "—"}
                    </b>

                    <small>
                      {visit.contact?.phone ||
                        visit.lead?.phone ||
                        ""}
                    </small>
                  </td>

                  {/* PROPERTY */}

                  <td>
                    <b>
                      {visit.property?.title ||
                        "—"}
                    </b>

                    <small>
                      {visit.property?.location ||
                        ""}
                    </small>
                  </td>

                  {/* DATE */}

                  <td>
                    {visit.visitDate
                      ? fmtDate(
                          visit.visitDate
                        )
                      : "—"}
                  </td>

                  {/* VISITORS */}

                  <td>
                    {visit.visitors || 1}
                  </td>

                  {/* STATUS */}

                  <td>
                    <Badge
                      text={
                        visit.status ||
                        "Scheduled"
                      }
                    />
                  </td>

                  {/* FEEDBACK */}

                  <td>
                    {visit.feedback || "—"}
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <button
                      className="table-btn"
                      onClick={() =>
                        openEdit(visit)
                      }
                      title="Edit Site Visit"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      className="table-btn danger"
                      onClick={() =>
                        del(visit._id)
                      }
                      title="Delete Site Visit"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {!items.length &&
                !loading && (
                  <tr>
                    <td colSpan="7">
                      <Empty text="No site visits scheduled." />
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        )}
      </div>

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      {show && (
        <Modal
          title={
            editing
              ? "Edit Site Visit"
              : "Schedule Site Visit"
          }
          close={closeModal}
        >
          <form
            onSubmit={save}
            className="form-grid"
          >
            {/* CUSTOMER */}

            {select(
              "Customer",
              "contact",
              [""].concat(
                contacts.map(
                  (contact) =>
                    contact._id
                )
              ),
              form,
              setForm,
              [
                {
                  v: "",
                  l: "Select Customer",
                },

                ...contacts.map(
                  (contact) => ({
                    v: contact._id,
                    l: `${contact.name} • ${
                      contact.phone || ""
                    }`,
                  })
                ),
              ]
            )}

            {/* PROPERTY */}

            {select(
              "Property",
              "property",
              [""].concat(
                properties.map(
                  (property) =>
                    property._id
                )
              ),
              form,
              setForm,
              [
                {
                  v: "",
                  l: "Select Property",
                },

                ...properties.map(
                  (property) => ({
                    v: property._id,
                    l: `${property.title} • ${
                      property.location ||
                      ""
                    }`,
                  })
                ),
              ]
            )}

            {/* VISIT DATE */}

            {field(
              "Visit Date & Time",
              "visitDate",
              form,
              setForm,
              true,
              "datetime-local"
            )}

            {/* VISITORS */}

            {field(
              "Visitors",
              "visitors",
              form,
              setForm,
              false,
              "number"
            )}

            {/* STATUS */}

            {select(
              "Status",
              "status",
              [
                "Scheduled",
                "Completed",
                "Cancelled",
                "No Show",
              ],
              form,
              setForm
            )}

            {/* FEEDBACK */}

            {field(
              "Feedback",
              "feedback",
              form,
              setForm
            )}

            {/* NOTES */}

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
                ? "Update Site Visit"
                : "Save Site Visit"}
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

export default SiteVisits;
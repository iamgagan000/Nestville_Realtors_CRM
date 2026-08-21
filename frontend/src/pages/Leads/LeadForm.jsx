import React from "react";
import { field, select } from "../../components/forms/renderers/renderers";
import { stages } from "../../constants/menu";

export default function LeadForm({ form, setForm, onSubmit }) {
  return <form onSubmit={onSubmit} className="form-grid">{field("Name","name",form,setForm,true)}{field("Phone","phone",form,setForm,true)}{field("Email","email",form,setForm)}{field("Budget (₹)","budget",form,setForm,false,"number")}{field("Location","location",form,setForm)}{field("Property Type","propertyType",form,setForm)}{select("Source","source",["Website","Facebook","Instagram","Referral","Walk-in","99acres","MagicBricks","Other"],form,setForm)}{select("Status","status",stages.slice(0,6),form,setForm)}{select("Priority","priority",["Low","Medium","High"],form,setForm)}{field("Notes","notes",form,setForm)}<button className="primary full form-submit">Save Lead</button></form>;
}

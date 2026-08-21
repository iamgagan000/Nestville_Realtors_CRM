import React from "react";
import Field from "../Field/Field";
import Select from "../Select/Select";

export function field(label, name, form, setForm, required = false, type = "text") {
  return <Field label={label} name={name} form={form} setForm={setForm} required={required} type={type} />;
}

export function select(label, name, options, form, setForm, custom) {
  return <Select label={label} name={name} options={options} form={form} setForm={setForm} custom={custom} />;
}

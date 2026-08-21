import React from "react";
export default function Badge({ text }) { return <span className={`badge ${String(text).toLowerCase().replaceAll(" ", "-")}`}>{text || "—"}</span>; }

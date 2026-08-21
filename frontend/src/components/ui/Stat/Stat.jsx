import React from "react";
export default function Stat({ label, value, icon: Icon }) { return <div className="stat"><div className="stat-icon"><Icon size={19}/></div><div><span>{label}</span><strong>{value}</strong></div></div>; }

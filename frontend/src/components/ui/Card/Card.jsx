import React from "react";
export default function Card({ title, action, children }) { return <div className="card"><div className="card-head"><h3>{title}</h3>{action}</div>{children}</div>; }

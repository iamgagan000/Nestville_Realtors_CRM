import React from "react";
export default function Page({ title, subtitle, action, children }) { return <><div className="page-head"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>{children}</>; }

import React from "react";
import Card from "../../components/ui/Card/Card";
import Empty from "../../components/ui/Empty/Empty";

export default function ReportCard({ title, rows, value }) {
  const max = Math.max(1, ...rows.map(x => Number(x[value] || 0)));
  return <Card title={title}>{rows.length ? <div className="bars">{rows.map(x => <div className="bar-row" key={x._id}><div><span>{x._id || "Unknown"}</span><b>{value === "amount" ? `₹${((x[value] || 0) / 100000).toFixed(1)}L` : x[value]}</b></div><div className="bar"><i style={{ width: `${(Number(x[value] || 0) / max) * 100}%` }}/></div></div>)}</div> : <Empty/>}</Card>;
}

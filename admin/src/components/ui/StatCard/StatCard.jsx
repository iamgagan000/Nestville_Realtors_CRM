import React from "react";
export default function StatCard({ icon: Icon, label, value }) { return <div className="stat"><Icon/><small>{label}</small><strong>{value}</strong></div>; }

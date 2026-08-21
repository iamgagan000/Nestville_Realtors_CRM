import React from "react";
import { NavLink } from "react-router-dom";
export default function Quick({ to, icon: Icon, text }) { return <NavLink className="quick" to={to}><Icon/><span>{text}</span></NavLink>; }

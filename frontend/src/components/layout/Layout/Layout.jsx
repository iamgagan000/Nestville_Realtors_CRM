import  React,{ useState } from "react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { menu } from "../../../constants/menu";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("estate_user") || "null");
  function logout() { localStorage.removeItem("estate_token"); localStorage.removeItem("estate_user"); navigate("/login"); }
  return <div className="app-shell"><aside className={open ? "sidebar open" : "sidebar"}><div className="brand"><img className="brand-logo" src="/nestville-logo.jpg" alt="Nestville Realtors"/><button className="icon-btn mobile-close" onClick={() => setOpen(false)}><X size={18}/></button></div><nav>{menu.map(([label,path,Icon]) => <NavLink key={path} to={path} end={path === "/"} onClick={() => setOpen(false)} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Icon size={18}/><span>{label}</span></NavLink>)}</nav><div className="sidebar-user"><div className="avatar">{user?.name?.[0]?.toUpperCase() || "N"}</div><div><b>{user?.name || "CRM User"}</b><small>{user?.role || "agent"}</small></div><button className="icon-btn" onClick={logout}><LogOut size={16}/></button></div></aside><main className="main"><header className="topbar"><button className="icon-btn mobile-menu" onClick={() => setOpen(true)}><Menu/></button><div className="breadcrumb">EstateCRM <span>/</span> Workspace</div><div className="top-actions"><button className="icon-btn" onClick={() => navigate("/follow-ups")}><Bell size={19}/></button><div className="profile-dot">{user?.name?.[0]?.toUpperCase() || "N"}</div></div></header><section className="content">{children}</section></main></div>;
}

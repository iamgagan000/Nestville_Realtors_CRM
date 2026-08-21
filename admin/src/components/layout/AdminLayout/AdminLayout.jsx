import React from "react";
import { ExternalLink, LogOut, RefreshCw } from "lucide-react";

export default function AdminLayout({ children, onLogout, onRefresh }) { return <div className="admin"><header><div className="logo"><img src="/nestville-logo.jpg" alt="Nestville Realtors"/><span>NESTVILLE REALTORS</span><small>ADMIN</small></div><div className="header-actions"><a href="http://localhost:5173/" target="_blank" rel="noreferrer"><ExternalLink size={15}/> CRM</a><button onClick={onRefresh}><RefreshCw size={16}/> Refresh</button><button onClick={onLogout}><LogOut size={16}/> Logout</button></div></header><main>{children}</main></div>; }

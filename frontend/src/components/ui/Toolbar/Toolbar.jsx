import React from "react";
import { RefreshCw, Search } from "lucide-react";
export default function Toolbar({ search, setSearch, onSearch, children }) { return <div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && onSearch?.()}/></div>{children}<button className="icon-btn" onClick={onSearch}><RefreshCw size={17}/></button></div>; }

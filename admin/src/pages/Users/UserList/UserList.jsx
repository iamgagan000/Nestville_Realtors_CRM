import React from "react";
import { Trash2 } from "lucide-react";
export default function UserList({ users, onDelete }) { return <section className="card"><h2>Team Members</h2><div className="users">{users.map(u=><div className="user" key={u._id}><div className="avatar">{u.name?.[0]?.toUpperCase()||"U"}</div><div><b>{u.name}</b><small>{u.email}</small></div><span>{u.role}</span><button onClick={()=>onDelete(u._id)} title="Delete user"><Trash2 size={16}/></button></div>)}{!users.length&&<p className="empty">No users found.</p>}</div></section>; }

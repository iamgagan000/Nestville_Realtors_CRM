import React from "react";
import { Building2, ShieldCheck, UserPlus, Users } from "lucide-react";
import StatCard from "../../../components/ui/StatCard/StatCard";
import ErrorBanner from "../../../components/ui/ErrorBanner/ErrorBanner";
import UserForm from "../../Users/UserForm/UserForm";
import UserList from "../../Users/UserList/UserList";

export default function AdminDashboard({ users, stats, error, onCreateUser, onDeleteUser }) {
  return <><div className="head"><div><h1>Admin Control Center</h1><p>Manage users, CRM access and workspace operations.</p></div><ShieldCheck size={35}/></div><ErrorBanner message={error}/><div className="stats"><StatCard icon={Users} label="Users" value={users.length}/><StatCard icon={UserPlus} label="Leads" value={stats?.leads||0}/><StatCard icon={Building2} label="Properties" value={stats?.properties||0}/></div><div className="grid"><UserForm onSubmit={onCreateUser}/><UserList users={users} onDelete={onDeleteUser}/></div></>;
}

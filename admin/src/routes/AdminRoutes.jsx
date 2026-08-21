import React from "react"
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";

export default function AdminRoutes({ users, stats, error, onCreateUser, onDeleteUser, onRefresh, onLogout }) {
  return <AdminLayout onRefresh={onRefresh} onLogout={onLogout}><AdminDashboard users={users} stats={stats} error={error} onCreateUser={onCreateUser} onDeleteUser={onDeleteUser}/></AdminLayout>;
}

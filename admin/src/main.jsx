import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import AdminLogin from "./pages/Auth/AdminLogin/AdminLogin";
import AdminRoutes from "./routes/AdminRoutes";
import api from "./api/client";
import "./styles.css";

function hasAdminSession(){
  const token=localStorage.getItem("estate_admin_token");
  const user=JSON.parse(localStorage.getItem("estate_admin_user")||"null");
  return Boolean(token && user?.role === "admin");
}

function AdminApp(){
 const [auth,setAuth]=useState(hasAdminSession());
 const [users,setUsers]=useState([]); const [stats,setStats]=useState(null); const [error,setError]=useState("");
 const load=async()=>{try{const [u,d]=await Promise.all([api.get("/users"),api.get("/dashboard")]);setUsers(u.data.users||[]);setStats(d.data.stats||{});setError("")}catch(e){setError(e.response?.data?.message||"Unable to load admin data")}};
 useEffect(()=>{if(auth)load()},[auth]);
 useEffect(()=>{const handler=()=>{setAuth(false)}; window.addEventListener("estate-admin-logout",handler); return ()=>window.removeEventListener("estate-admin-logout",handler)},[]);
 async function createUser(form){try{await api.post("/users",form);await load()}catch(e){setError(e.response?.data?.message||"Could not create user")}}
 async function deleteUser(id){if(!window.confirm("Delete this user?"))return;try{await api.delete(`/users/${id}`);await load()}catch(e){setError(e.response?.data?.message||"Could not delete user")}}
 function logout(){localStorage.removeItem("estate_admin_token");localStorage.removeItem("estate_admin_user");setUsers([]);setStats(null);setAuth(false)}
 return auth ? <AdminRoutes users={users} stats={stats} error={error} onCreateUser={createUser} onDeleteUser={deleteUser} onRefresh={load} onLogout={logout}/> : <AdminLogin onLogin={()=>setAuth(true)}/>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><AdminApp/></React.StrictMode>);

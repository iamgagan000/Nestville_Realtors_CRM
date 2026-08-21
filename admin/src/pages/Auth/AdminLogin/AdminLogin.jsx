import React, { useState } from "react";
import api from "../../../api/client";

export default function AdminLogin({ onLogin }) {
  const [form,setForm]=useState({email:"admin@estatecrm.com",password:"admin123"});
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e){
    e.preventDefault(); setError(""); setLoading(true);
    try { const {data}=await api.post("/auth/login",form); if(data.user?.role!=="admin") throw new Error("Admin account required"); localStorage.setItem("estate_admin_token",data.token); localStorage.setItem("estate_admin_user",JSON.stringify(data.user)); onLogin(data.user); }
    catch(e){ setError(e.response?.data?.message || e.message || "Login failed"); } finally { setLoading(false); }
  }
  return <div className="login"><div className="login-card"><div className="login-brand"><img src="/nestville-logo.jpg" alt="Nestville Realtors"/><div><b>NESTVILLE REALTORS</b><small>ADMIN CONTROL CENTER</small></div></div><h1>Admin Sign In</h1><p>Manage users, CRM access and workspace operations.</p><form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<div className="error">{error}</div>}<button disabled={loading} className="primary">{loading?"Signing in...":"Sign In"}</button></form><small className="hint">Default local admin: admin@estatecrm.com / admin123</small></div></div>;
}

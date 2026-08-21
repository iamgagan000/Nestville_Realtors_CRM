import  React,{ useState } from "react";

const initial={name:"",email:"",password:"admin123",role:"agent"};
export default function UserForm({ onSubmit }) {
 const [form,setForm]=useState(initial); const [saving,setSaving]=useState(false);
 async function submit(e){e.preventDefault();setSaving(true);try{await onSubmit(form);setForm(initial)}finally{setSaving(false)}}
 return <section className="card"><h2>Create User</h2><form onSubmit={submit}>{["name","email","password"].map(x=><label key={x}>{x}<input type={x==="password"?"password":x==="email"?"email":"text"} required value={form[x]} onChange={e=>setForm({...form,[x]:e.target.value})}/></label>)}<label>role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="agent">Agent</option><option value="manager">Manager</option><option value="admin">Admin</option></select></label><button disabled={saving} className="primary">{saving?"Creating...":"Create User"}</button></form></section>;
}

import  React,{ useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import api from "../../api";
import Page from "../../components/ui/Page/Page";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";
import { field, select } from "../../components/forms/renderers/renderers";
import { fmtDate } from "../../utils/formatters";

function FollowUps(){
 const [items,setItems]=useState([]),[contacts,setContacts]=useState([]),[show,setShow]=useState(false),[editing,setEditing]=useState(null);const empty={contact:"",dueDate:"",type:"Call",status:"Pending",notes:""};const [form,setForm]=useState(empty);const load=()=>api.get("/follow-ups").then(r=>setItems(r.data.items||[]));useEffect(()=>{load();api.get("/contacts").then(r=>setContacts(r.data.items||[]))},[]);
 async function save(e){e.preventDefault();const b={...form,contact:form.contact||undefined};if(editing)await api.put(`/follow-ups/${editing._id}`,b);else await api.post("/follow-ups",b);setShow(false);setEditing(null);setForm(empty);load()}async function del(id){if(confirm("Delete follow-up?")){await api.delete(`/follow-ups/${id}`);load()}}
 return <Page title="Follow Ups" subtitle="Never miss the next call, message or meeting." action={<button className="primary" onClick={()=>{setEditing(null);setForm(empty);setShow(true)}}><Plus size={16}/> Schedule Follow Up</button>}><div className="table-card"><table><thead><tr><th>Customer</th><th>Due</th><th>Type</th><th>Notes</th><th>Status</th><th/></tr></thead><tbody>{items.map(f=><tr key={f._id}><td><b>{f.contact?.name||f.lead?.name||"—"}</b><small>{f.contact?.phone||f.lead?.phone||""}</small></td><td>{fmtDate(f.dueDate)}</td><td>{f.type}</td><td>{f.notes||"—"}</td><td><Badge text={f.status}/></td><td><button className="table-btn" onClick={()=>{setEditing(f);setForm({...empty,...f,contact:f.contact?._id||"",dueDate:f.dueDate?.slice(0,16)||""});setShow(true)}}><Edit3 size={15}/></button><button className="table-btn danger" onClick={()=>del(f._id)}><Trash2 size={15}/></button></td></tr>)}{!items.length&&<tr><td colSpan="6"><Empty text="No follow-ups scheduled."/></td></tr>}</tbody></table></div>{show&&<Modal title={editing?"Edit Follow Up":"Schedule Follow Up"} close={()=>setShow(false)}><form onSubmit={save} className="form-grid">{select("Contact","contact",[""].concat(contacts.map(c=>c._id)),form,setForm,contacts.map(c=>({v:c._id,l:`${c.name} • ${c.phone}`})))}{field("Due Date & Time","dueDate",form,setForm,true,"datetime-local")}{select("Type","type",["Call","WhatsApp","Email","Meeting","Other"],form,setForm)}{select("Status","status",["Pending","Completed","Missed","Rescheduled"],form,setForm)}{field("Notes","notes",form,setForm)}<button className="primary full form-submit">Save Follow Up</button></form></Modal>}</Page>
}

export default FollowUps;

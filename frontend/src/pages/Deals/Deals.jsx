import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import api from "../../api";
import Page from "../../components/ui/Page/Page";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";
import { field, select } from "../../components/forms/renderers/renderers";
import { stages } from "../../constants/menu";

function Deals(){
 const [items,setItems]=useState([]),[contacts,setContacts]=useState([]),[properties,setProperties]=useState([]),[show,setShow]=useState(false),[editing,setEditing]=useState(null);const empty={title:"",contact:"",property:"",value:"",stage:"New",probability:20,expectedClose:"",notes:""};const [form,setForm]=useState(empty);
 const load=()=>api.get("/deals").then(r=>setItems(r.data.items||[]));useEffect(()=>{load();api.get("/contacts").then(r=>setContacts(r.data.items||[]));api.get("/properties").then(r=>setProperties(r.data.properties||[]))},[]);
 async function save(e){e.preventDefault();const b={...form,value:Number(form.value)||0,probability:Number(form.probability)||0,contact:form.contact||undefined,property:form.property||undefined};if(editing)await api.put(`/deals/${editing._id}`,b);else await api.post("/deals",b);setShow(false);setEditing(null);setForm(empty);load()}
 async function del(id){if(confirm("Delete deal?")){await api.delete(`/deals/${id}`);load()}}
 const grouped=stages.map(stage=>({stage,items:items.filter(x=>x.stage===stage)}));
 return <Page title="Deals / Pipeline" subtitle="Move opportunities from first contact to closed revenue." action={<button className="primary" onClick={()=>{setEditing(null);setForm(empty);setShow(true)}}><Plus size={16}/> New Deal</button>}><div className="kanban">{grouped.map(g=><div className="kanban-col" key={g.stage}><div className="kanban-head"><b>{g.stage}</b><span>{g.items.length}</span></div>{g.items.map(d=><div className="deal-card" key={d._id}><div className="row-between"><b>{d.title}</b><button className="mini-icon" onClick={()=>{setEditing(d);setForm({...empty,...d,contact:d.contact?._id||d.contact||"",property:d.property?._id||d.property||"",expectedClose:d.expectedClose?d.expectedClose.slice(0,10):""});setShow(true)}}><Edit3 size={14}/></button></div><small>{d.contact?.name||"No contact"} · {d.property?.title||"No property"}</small><strong>₹{((d.value||0)/100000).toFixed(1)}L</strong><div className="deal-footer"><Badge text={`${d.probability||0}%`}/><button className="mini-icon danger" onClick={()=>del(d._id)}><Trash2 size={14}/></button></div></div>)}{!g.items.length&&<div className="kanban-empty">Drop opportunity here</div>}</div>)}</div>{show&&<Modal title={editing?"Edit Deal":"Create Deal"} close={()=>setShow(false)} wide><form onSubmit={save} className="form-grid">{field("Deal Title","title",form,setForm,true)}{field("Value (₹)","value",form,setForm,true,"number")}{select("Contact","contact",[""].concat(contacts.map(c=>c._id)),form,setForm,contacts.map(c=>({v:c._id,l:`${c.name} • ${c.phone}`})))}{select("Property","property",[""].concat(properties.map(p=>p._id)),form,setForm,properties.map(p=>({v:p._id,l:p.title})))}{select("Stage","stage",stages,form,setForm)}{field("Probability %","probability",form,setForm,false,"number")}{field("Expected Close","expectedClose",form,setForm,false,"date")}{field("Notes","notes",form,setForm)}<button className="primary full form-submit">Save Deal</button></form></Modal>}</Page>
}

export default Deals;

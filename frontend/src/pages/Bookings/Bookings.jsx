import  React,{ useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import api from "../../api";
import Page from "../../components/ui/Page/Page";
import Modal from "../../components/ui/Modal/Modal";
import Empty from "../../components/ui/Empty/Empty";
import Badge from "../../components/ui/Badge/Badge";
import { field, select } from "../../components/forms/renderers/renderers";
import { fmtDate } from "../../utils/formatters";

function Bookings(){
 const [items,setItems]=useState([]),[contacts,setContacts]=useState([]),[properties,setProperties]=useState([]),[show,setShow]=useState(false),[editing,setEditing]=useState(null);const empty={customer:"",property:"",unit:"",bookingDate:new Date().toISOString().slice(0,10),amount:"",paymentStatus:"Pending",status:"Reserved",notes:""};const [form,setForm]=useState(empty);const load=()=>api.get("/bookings").then(r=>setItems(r.data.items||[]));useEffect(()=>{load();api.get("/contacts").then(r=>setContacts(r.data.items||[]));api.get("/properties").then(r=>setProperties(r.data.properties||[]))},[]);
 async function save(e){e.preventDefault();const b={...form,amount:Number(form.amount)||0};if(editing)await api.put(`/bookings/${editing._id}`,b);else await api.post("/bookings",b);setShow(false);setEditing(null);setForm(empty);load()}
 async function del(id){if(confirm("Delete booking?")){await api.delete(`/bookings/${id}`);load()}}
 return <Page title="Bookings" subtitle="Manage reservations, payments and booked inventory." action={<button className="primary" onClick={()=>{setEditing(null);setForm(empty);setShow(true)}}><Plus size={16}/> New Booking</button>}><div className="table-card"><table><thead><tr><th>Booking</th><th>Customer</th><th>Property / Unit</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th><th/></tr></thead><tbody>{items.map(b=><tr key={b._id}><td><b>{b.bookingNo}</b></td><td>{b.customer?.name||"—"}<small>{b.customer?.phone||""}</small></td><td>{b.property?.title||"—"}<small>{b.unit||"Unit not set"}</small></td><td>{fmtDate(b.bookingDate)}</td><td>₹{((b.amount||0)/100000).toFixed(2)}L</td><td><Badge text={b.paymentStatus}/></td><td><Badge text={b.status}/></td><td><button className="table-btn" onClick={()=>{setEditing(b);setForm({...empty,...b,customer:b.customer?._id||"",property:b.property?._id||"",bookingDate:b.bookingDate?.slice(0,10)||""});setShow(true)}}><Edit3 size={15}/></button><button className="table-btn danger" onClick={()=>del(b._id)}><Trash2 size={15}/></button></td></tr>)}{!items.length&&<tr><td colSpan="8"><Empty text="No bookings yet."/></td></tr>}</tbody></table></div>{show&&<Modal title={editing?"Edit Booking":"New Booking"} close={()=>setShow(false)}><form onSubmit={save} className="form-grid">{select("Customer","customer",[""].concat(contacts.map(c=>c._id)),form,setForm,contacts.map(c=>({v:c._id,l:`${c.name} • ${c.phone}`})))}{select("Property","property",[""].concat(properties.map(p=>p._id)),form,setForm,properties.map(p=>({v:p._id,l:p.title})))}{field("Unit / Flat","unit",form,setForm)}{field("Booking Date","bookingDate",form,setForm,false,"date")}{field("Amount (₹)","amount",form,setForm,false,"number")}{select("Payment Status","paymentStatus",["Pending","Partial","Paid","Refunded"],form,setForm)}{select("Booking Status","status",["Reserved","Confirmed","Cancelled","Completed"],form,setForm)}{field("Notes","notes",form,setForm)}<button className="primary full form-submit">Save Booking</button></form></Modal>}</Page>
}

export default Bookings;

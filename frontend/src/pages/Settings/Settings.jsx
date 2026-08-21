import React, { useEffect, useState } from "react";
import api from "../../api";
import Page from "../../components/ui/Page/Page";
import Card from "../../components/ui/Card/Card";
import { field } from "../../components/forms/renderers/renderers";

function Settings(){
 const [form,setForm]=useState({companyName:"",phone:"",email:"",address:"",currency:"INR",leadSources:[],dealStages:[],notifications:true});const [msg,setMsg]=useState("");
 useEffect(()=>{api.get("/settings").then(r=>setForm({...r.data.setting,leadSources:r.data.setting.leadSources||[],dealStages:r.data.setting.dealStages||[]}))},[]);
 async function save(e){e.preventDefault();await api.put("/settings",form);setMsg("Settings saved successfully.");setTimeout(()=>setMsg(""),2500)}
 return <Page title="Settings" subtitle="Configure your company and CRM workflow."><form onSubmit={save}><div className="settings-grid"><Card title="Company Profile"><div className="form-stack">{field("Company Name","companyName",form,setForm,true)}{field("Phone","phone",form,setForm)}{field("Email","email",form,setForm,"","email")}{field("Address","address",form,setForm)}</div></Card><Card title="CRM Workflow"><div className="form-stack">{field("Lead Sources (comma separated)","leadSources",form,setForm)}{field("Deal Stages (comma separated)","dealStages",form,setForm)}<label className="toggle"><input type="checkbox" checked={form.notifications} onChange={e=>setForm({...form,notifications:e.target.checked})}/><span>Enable CRM notifications</span></label></div></Card></div>{msg&&<div className="success">{msg}</div>}<button className="primary settings-save">Save Settings</button></form></Page>
}

export default Settings;

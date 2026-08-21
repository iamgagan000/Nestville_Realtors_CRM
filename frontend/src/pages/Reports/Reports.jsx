import React, { useEffect, useState } from "react";
import { Bell, IndianRupee, MapPin } from "lucide-react";
import api from "../../api";
import Page from "../../components/ui/Page/Page";
import Stat from "../../components/ui/Stat/Stat";
import Empty from "../../components/ui/Empty/Empty";
import ReportCard from "./ReportCard";

function Reports(){
 const [d,setD]=useState(null);useEffect(()=>{api.get("/reports").then(r=>setD(r.data.data))},[]);
 return <Page title="Reports & Analytics" subtitle="Measure lead generation, pipeline, visits and revenue."><div className="stats"><Stat label="Booked Revenue" value={`₹${((d?.revenue||0)/100000).toFixed(1)}L`} icon={IndianRupee}/><Stat label="Site Visits" value={d?.visits||0} icon={MapPin}/><Stat label="Pending Follow Ups" value={d?.followups||0} icon={Bell}/></div><div className="grid-2"><ReportCard title="Leads by Source" rows={d?.leadBySource||[]} value="count"/><ReportCard title="Deals by Stage" rows={d?.dealByStage||[]} value="count"/><ReportCard title="Booking Payments" rows={d?.bookingByStatus||[]} value="amount"/></div></Page>
}

export default Reports;

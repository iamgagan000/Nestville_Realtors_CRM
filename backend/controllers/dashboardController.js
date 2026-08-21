import Lead from "../models/Lead.js";import Property from "../models/Property.js";import Task from "../models/Task.js";import Deal from "../models/Deal.js";import Booking from "../models/Booking.js";import FollowUp from "../models/FollowUp.js";import SiteVisit from "../models/SiteVisit.js";
export async function dashboard(req,res,next){try{
 const [leads,properties,pendingTasks,newLeads,deals,bookings,followUps,siteVisits,pipeline,revenue]=await Promise.all([
  Lead.countDocuments(),Property.countDocuments(),Task.countDocuments({status:{$ne:"Completed"}}),Lead.countDocuments({status:"New"}),Deal.countDocuments({stage:{$nin:["Won","Lost"]}}),Booking.countDocuments({status:{$in:["Reserved","Confirmed"]}}),FollowUp.countDocuments({status:"Pending"}),SiteVisit.countDocuments({status:"Scheduled"}),Deal.aggregate([{$group:{_id:"$stage",count:{$sum:1},value:{$sum:"$value"}}}]),Booking.aggregate([{$match:{status:{$in:["Confirmed","Completed"]}}},{$group:{_id:null,total:{$sum:"$amount"}}}])
 ]);
 res.json({success:true,stats:{leads,properties,pendingTasks,newLeads,deals,bookings,followUps,siteVisits,revenue:revenue[0]?.total||0},pipeline});
}catch(e){next(e)}}

import Lead from "../models/Lead.js";import Deal from "../models/Deal.js";import Booking from "../models/Booking.js";import SiteVisit from "../models/SiteVisit.js";import FollowUp from "../models/FollowUp.js";
export async function report(req,res,next){try{
 const [leadBySource,dealByStage,bookingByStatus,visits,followups,revenue] = await Promise.all([
  Lead.aggregate([{$group:{_id:"$source",count:{$sum:1}}},{$sort:{count:-1}}]),
  Deal.aggregate([{$group:{_id:"$stage",count:{$sum:1},value:{$sum:"$value"}}}]),
  Booking.aggregate([{$group:{_id:"$paymentStatus",count:{$sum:1},amount:{$sum:"$amount"}}}]),
  SiteVisit.countDocuments(),FollowUp.countDocuments({status:"Pending"}),
  Booking.aggregate([{$match:{status:{$in:["Confirmed","Completed"]}}},{$group:{_id:null,total:{$sum:"$amount"}}}])
 ]);
 res.json({success:true,data:{leadBySource,dealByStage,bookingByStatus,visits,followups,revenue:revenue[0]?.total||0}});
}catch(e){next(e)}}

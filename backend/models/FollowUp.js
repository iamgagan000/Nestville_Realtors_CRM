import mongoose from "mongoose";
const schema=new mongoose.Schema({
  contact:{type:mongoose.Schema.Types.ObjectId,ref:"Contact"}, lead:{type:mongoose.Schema.Types.ObjectId,ref:"Lead"},
  dueDate:{type:Date,required:true}, type:{type:String,enum:["Call","WhatsApp","Email","Meeting","Other"],default:"Call"},
  status:{type:String,enum:["Pending","Completed","Missed","Rescheduled"],default:"Pending"},
  notes:String, assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});
export default mongoose.model("FollowUp",schema);

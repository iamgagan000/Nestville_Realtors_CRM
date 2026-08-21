import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, phone:{type:String,required:true,trim:true}, email:String,
  company:String, source:{type:String,default:"Website"}, budget:Number, location:String,
  propertyInterest:String, status:{type:String,enum:["New","Contacted","Qualified","Active","Inactive"],default:"New"},
  notes:String, assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});
export default mongoose.model("Contact",schema);

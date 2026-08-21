import mongoose from "mongoose";
const schema=new mongoose.Schema({
  key:{type:String,unique:true,required:true},
  companyName:{type:String,default:"Nestville Realtors"}, phone:String,email:String,address:String,
  currency:{type:String,default:"INR"}, leadSources:[String], dealStages:[String], notifications:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model("Setting",schema);

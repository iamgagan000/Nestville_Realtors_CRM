import mongoose from "mongoose";
const schema = new mongoose.Schema({
  bookingNo:{type:String,unique:true}, customer:{type:mongoose.Schema.Types.ObjectId,ref:"Contact"},
  property:{type:mongoose.Schema.Types.ObjectId,ref:"Property"}, deal:{type:mongoose.Schema.Types.ObjectId,ref:"Deal"},
  unit:String, bookingDate:{type:Date,default:Date.now}, amount:{type:Number,default:0},
  paymentStatus:{type:String,enum:["Pending","Partial","Paid","Refunded"],default:"Pending"},
  status:{type:String,enum:["Reserved","Confirmed","Cancelled","Completed"],default:"Reserved"},
  notes:String, assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});
schema.pre("validate",function(next){if(!this.bookingNo)this.bookingNo="BK-"+Date.now().toString(36).toUpperCase();next()});
export default mongoose.model("Booking",schema);

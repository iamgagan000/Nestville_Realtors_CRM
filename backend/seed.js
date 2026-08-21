import dotenv from "dotenv";import mongoose from "mongoose";import bcrypt from "bcryptjs";
import User from "./models/User.js";import Lead from "./models/Lead.js";import Property from "./models/Property.js";import Contact from "./models/Contact.js";import Deal from "./models/Deal.js";import Booking from "./models/Booking.js";import Task from "./models/Task.js";import FollowUp from "./models/FollowUp.js";import SiteVisit from "./models/SiteVisit.js";import Setting from "./models/Setting.js";
dotenv.config();await mongoose.connect(process.env.MONGO_URI);
const password=await bcrypt.hash(process.env.ADMIN_PASSWORD||"admin123",10);
const admin=await User.findOneAndUpdate({email:"admin@estatecrm.com"},{name:"Nestville Admin",email:"admin@estatecrm.com",password,role:"admin"},{upsert:true,new:true});
const agent=await User.findOneAndUpdate({email:"sales@nestville.com"},{name:"Sales Executive",email:"sales@nestville.com",password,role:"agent"},{upsert:true,new:true});
await Promise.all([Lead.deleteMany({}),Property.deleteMany({}),Contact.deleteMany({}),Deal.deleteMany({}),Booking.deleteMany({}),Task.deleteMany({}),FollowUp.deleteMany({}),SiteVisit.deleteMany({})]);
const properties=await Property.insertMany([
 {title:"Aarize Sector 4",project:"Aarize Group",location:"Techzone 4, Greater Noida West",bhk:"2 BHK",minPrice:4500000,maxPrice:6200000,status:"Available",amenities:["Clubhouse","Pool","Gym"]},
 {title:"Godrej Palm Retreat",project:"Godrej Properties",location:"Sector 150, Noida",bhk:"2/3 BHK",minPrice:11000000,maxPrice:18000000,status:"Available",amenities:["Golf Course","Clubhouse","Pool"]}
]);
const contacts=await Contact.insertMany([
 {name:"Rahul Sharma",phone:"9876543210",email:"rahul@example.com",location:"Techzone 4",budget:6500000,propertyInterest:"2 BHK",status:"Qualified",assignedTo:agent._id},
 {name:"Priya Verma",phone:"9876501234",email:"priya@example.com",location:"Sector 150",budget:12000000,propertyInterest:"3 BHK",status:"Active",assignedTo:agent._id},
 {name:"Amit Kumar",phone:"9876512345",location:"Noida Extension",budget:5500000,propertyInterest:"2 BHK",status:"New",assignedTo:agent._id}
]);
const leads=await Lead.insertMany([
 {name:"Rahul Sharma",phone:"9876543210",email:"rahul@example.com",location:"Techzone 4",budget:6500000,status:"Qualified",priority:"High",assignedTo:agent._id},
 {name:"Priya Verma",phone:"9876501234",email:"priya@example.com",location:"Sector 150",budget:12000000,status:"Site Visit",priority:"Medium",assignedTo:agent._id},
 {name:"Amit Kumar",phone:"9876512345",location:"Noida Extension",budget:5500000,status:"New",priority:"Low",assignedTo:agent._id}
]);
const deal=await Deal.create({title:"Rahul – Aarize 2 BHK",contact:contacts[0]._id,lead:leads[0]._id,property:properties[0]._id,value:5800000,stage:"Negotiation",probability:70,assignedTo:agent._id});
await Booking.create({customer:contacts[1]._id,property:properties[1]._id,unit:"Tower B / 1204",amount:1500000,paymentStatus:"Partial",status:"Confirmed",assignedTo:agent._id});
await Task.insertMany([{title:"Call Rahul Sharma",dueDate:new Date(Date.now()+86400000),priority:"High",lead:leads[0]._id,assignedTo:agent._id},{title:"Send brochure to Priya",dueDate:new Date(Date.now()+2*86400000),priority:"Medium",assignedTo:agent._id}]);
await FollowUp.create({contact:contacts[0]._id,dueDate:new Date(Date.now()+86400000),type:"Call",status:"Pending",notes:"Discuss final price and payment plan",assignedTo:agent._id});
await SiteVisit.create({contact:contacts[1]._id,property:properties[1]._id,visitDate:new Date(Date.now()+2*86400000),status:"Scheduled",visitors:2,assignedTo:agent._id});
await Setting.findOneAndUpdate({key:"company"},{key:"company",companyName:"Nestville Realtors",phone:"+91 99999 99999",email:"sales@nestville.com",address:"Noida, Uttar Pradesh",leadSources:["Website","Facebook","Instagram","Referral","Walk-in"],dealStages:["New","Contacted","Qualified","Site Visit","Negotiation","Booking","Won","Lost"],notifications:true},{upsert:true,new:true});
console.log("Seed complete. Admin: admin@estatecrm.com / admin123");await mongoose.disconnect();

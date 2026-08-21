import Task from "../models/Task.js";
export async function listTasks(req,res,next){try{const tasks=await Task.find().populate("lead","name phone").populate("assignedTo","name").sort({dueDate:1});res.json({success:true,tasks})}catch(e){next(e)}}
export async function createTask(req,res,next){try{const task=await Task.create(req.body);res.status(201).json({success:true,task})}catch(e){next(e)}}
export async function updateTask(req,res,next){try{const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!task)return res.status(404).json({success:false,message:"Task not found"});res.json({success:true,task})}catch(e){next(e)}}
export async function deleteTask(req,res,next){try{await Task.findByIdAndDelete(req.params.id);res.json({success:true})}catch(e){next(e)}}

import Lead from "../models/Lead.js";

export async function listLeads(req, res, next) {
  try {
    const search = req.query.search || "";
    const filter = search
      ? { $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ]}
      : {};

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, leads });
  } catch (error) { next(error); }
}

export async function createLead(req, res, next) {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, lead });
  } catch (error) { next(error); }
}

export async function getLead(req, res, next) {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email");
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, lead });
  } catch (error) { next(error); }
}

export async function updateLead(req, res, next) {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, lead });
  } catch (error) { next(error); }
}

export async function deleteLead(req, res, next) {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) { next(error); }
}

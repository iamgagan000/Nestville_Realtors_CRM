import Property from "../models/Property.js";

export async function listProperties(req, res, next) {
  try {
    const search = req.query.search || "";
    const filter = search
      ? { $or: [
          { title: { $regex: search, $options: "i" } },
          { project: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ]}
      : {};
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) { next(error); }
}

export async function createProperty(req, res, next) {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, property });
  } catch (error) { next(error); }
}

export async function updateProperty(req, res, next) {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, property });
  } catch (error) { next(error); }
}

export async function deleteProperty(req, res, next) {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Property deleted" });
  } catch (error) { next(error); }
}

export function makeCrud(Model, { populate = [] } = {}) {
  /**
   * Apply mongoose populate configuration.
   *
   * Supported formats:
   *
   * 1. String
   *    "customer"
   *
   * 2. Array
   *    ["customer", "name phone"]
   *
   * 3. Object
   *    {
   *      path: "customer",
   *      select: "name phone"
   *    }
   */
  const applyPopulate = (query) => {
    return populate.reduce((currentQuery, item) => {
      // ---------------------------------
      // Simple string
      // ---------------------------------
      if (typeof item === "string") {
        return currentQuery.populate(item);
      }

      // ---------------------------------
      // Array format:
      // ["customer", "name phone"]
      // ---------------------------------
      if (Array.isArray(item)) {
        const [path, select] = item;

        if (!path) {
          return currentQuery;
        }

        return currentQuery.populate({
          path,
          ...(select ? { select } : {}),
        });
      }

      // ---------------------------------
      // Object format:
      // {
      //   path: "customer",
      //   select: "name phone"
      // }
      // ---------------------------------
      if (
        typeof item === "object" &&
        item !== null
      ) {
        return currentQuery.populate(item);
      }

      return currentQuery;
    }, query);
  };

  return {
    // ==========================================
    // LIST
    // GET /resource
    // ==========================================
    list: async (req, res, next) => {
      try {
        let query = Model.find().sort({
          createdAt: -1,
        });

        query = applyPopulate(query);

        const items = await query;

        res.json({
          success: true,
          items,
        });
      } catch (error) {
        next(error);
      }
    },

    // ==========================================
    // GET ONE
    // GET /resource/:id
    // ==========================================
    get: async (req, res, next) => {
      try {
        let query = Model.findById(
          req.params.id
        );

        query = applyPopulate(query);

        const item = await query;

        if (!item) {
          return res.status(404).json({
            success: false,
            message: "Record not found",
          });
        }

        res.json({
          success: true,
          item,
        });
      } catch (error) {
        next(error);
      }
    },

    // ==========================================
    // CREATE
    // POST /resource
    // ==========================================
    create: async (req, res, next) => {
      try {
        const item = await Model.create(
          req.body
        );

        // Populate newly created record as well
        let query = Model.findById(item._id);

        query = applyPopulate(query);

        const populatedItem = await query;

        res.status(201).json({
          success: true,
          item: populatedItem || item,
        });
      } catch (error) {
        next(error);
      }
    },

    // ==========================================
    // UPDATE
    // PUT /resource/:id
    // ==========================================
    update: async (req, res, next) => {
      try {
        let query = Model.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

        query = applyPopulate(query);

        const item = await query;

        if (!item) {
          return res.status(404).json({
            success: false,
            message: "Record not found",
          });
        }

        res.json({
          success: true,
          item,
        });
      } catch (error) {
        next(error);
      }
    },

    // ==========================================
    // DELETE
    // DELETE /resource/:id
    // ==========================================
    remove: async (req, res, next) => {
      try {
        const item =
          await Model.findByIdAndDelete(
            req.params.id
          );

        if (!item) {
          return res.status(404).json({
            success: false,
            message: "Record not found",
          });
        }

        res.json({
          success: true,
          message:
            "Record deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  };
}
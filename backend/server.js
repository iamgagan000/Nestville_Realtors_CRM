const app = express();

const allowedOrigins = [
  config.clientUrl,
  config.adminUrl,
  "https://nestville-realtors-crm-j1eg.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EstateCRM API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/follow-ups", followUpRoutes);
app.use("/api/site-visits", siteVisitRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

async function start() {
  try {
    await connectDB(config.mongoUri);

    await createAdminIfMissing({
      name: config.adminName,
      email: config.adminEmail,
      password: config.adminPassword,
    });

    app.listen(config.port, () => {
      console.log(`API running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

start();
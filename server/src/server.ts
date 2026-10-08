import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./lib/prisma";

import jobsRouter from "./routes/jobs";
import candidatesRouter from "./routes/candidates";
import applicationsRouter from "./routes/applications";
import interviewsRouter from "./routes/interviews";
import authRouter from "./routes/auth";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "HireFlow API is running 🚀",
    status: "success",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "HireFlow API",
    timestamp: new Date().toISOString(),
  });
});

/* ---------- Dashboard ---------- */

app.get("/api/dashboard", async (_req, res) => {
  try {
    const [
      openJobs,
      candidates,
      applications,
      interviews,
      offers,
      applied,
      screening,
      interviewStage,
    ] = await Promise.all([
      prisma.job.count({
        where: { status: "Active" },
      }),

      prisma.candidate.count(),

      prisma.application.count(),

      prisma.interview.count(),

      prisma.application.count({
        where: { stage: "Offer" },
      }),

      prisma.application.count({
        where: { stage: "Applied" },
      }),

      prisma.application.count({
        where: { stage: "Screening" },
      }),

      prisma.application.count({
        where: { stage: "Interview" },
      }),
    ]);

    res.json({
      openJobs,
      candidates,
      applications,
      interviews,
      offers,

      pipeline: {
        applied,
        screening,
        interview: interviewStage,
        offer: offers,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
});

/* ---------- API Routes ---------- */
app.use("/api/auth", authRouter);

app.use("/api/jobs", jobsRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/interviews", interviewsRouter);

/* ---------- 404 ---------- */

app.use((_req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

/* ---------- Error Handler ---------- */

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 HireFlow API running on http://localhost:${PORT}`);
});
import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/* GET INTERVIEWS */

router.get("/", async (_req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      orderBy: {
        scheduledAt: "asc",
      },
    });

    res.json(interviews);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch interviews",
    });
  }
});

/* SCHEDULE INTERVIEW */

router.post("/", async (req, res) => {
  try {
    const candidateId = Number(req.body.candidateId);
    const jobId = Number(req.body.jobId);
    const scheduledAt = new Date(req.body.scheduledAt);

    if (
      Number.isNaN(candidateId) ||
      Number.isNaN(jobId) ||
      Number.isNaN(scheduledAt.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid interview data",
      });
    }

    const interview = await prisma.interview.create({
      data: {
        candidateId,
        jobId,
        interviewer: String(req.body.interviewer || ""),
        type: String(req.body.type || "Technical"),
        mode: String(req.body.mode || "Video"),
        scheduledAt,
        status: String(req.body.status || "Scheduled"),
      },
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to schedule interview",
    });
  }
});

/* UPDATE INTERVIEW */

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data: {
      interviewer?: string;
      type?: string;
      mode?: string;
      scheduledAt?: Date;
      status?: string;
    } = {};

    if (req.body.interviewer !== undefined) {
      data.interviewer = String(req.body.interviewer);
    }

    if (req.body.type !== undefined) {
      data.type = String(req.body.type);
    }

    if (req.body.mode !== undefined) {
      data.mode = String(req.body.mode);
    }

    if (req.body.status !== undefined) {
      data.status = String(req.body.status);
    }

    if (req.body.scheduledAt !== undefined) {
      const date = new Date(req.body.scheduledAt);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid scheduled date",
        });
      }

      data.scheduledAt = date;
    }

    const interview = await prisma.interview.update({
      where: { id },
      data,
    });

    res.json(interview);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update interview",
    });
  }
});

/* DELETE INTERVIEW */

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.interview.delete({
      where: { id },
    });

    res.json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete interview",
    });
  }
});

export default router;
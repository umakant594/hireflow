import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/* =========================================================
   GET ALL APPLICATIONS
========================================================= */

router.get("/", async (_req, res) => {
  try {
    const applications =
      await prisma.application.findMany({
        orderBy: {
          appliedAt: "desc",
        },
      });

    /*
     * Application doesn't have Prisma relations
     * in the current schema, so we fetch the
     * candidates and jobs separately.
     */

    const candidateIds = [
      ...new Set(
        applications.map(
          (application) =>
            application.candidateId
        )
      ),
    ];

    const jobIds = [
      ...new Set(
        applications.map(
          (application) =>
            application.jobId
        )
      ),
    ];

    const [
      candidates,
      jobs,
    ] = await Promise.all([
      prisma.candidate.findMany({
        where: {
          id: {
            in: candidateIds,
          },
        },
      }),

      prisma.job.findMany({
        where: {
          id: {
            in: jobIds,
          },
        },
      }),
    ]);

    const candidateMap = new Map(
      candidates.map((candidate) => [
        candidate.id,
        candidate,
      ])
    );

    const jobMap = new Map(
      jobs.map((job) => [
        job.id,
        job,
      ])
    );

    const result = applications.map(
      (application) => ({
        ...application,

        candidate:
          candidateMap.get(
            application.candidateId
          ) || null,

        job:
          jobMap.get(
            application.jobId
          ) || null,
      })
    );

    res.json(result);
  } catch (error) {
    console.error(
      "Get applications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch applications",
    });
  }
});

/* =========================================================
   CREATE APPLICATION
========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      candidateId,
      jobId,
      stage,
      status,
    } = req.body;

    if (!candidateId || !jobId) {
      return res.status(400).json({
        message:
          "candidateId and jobId are required",
      });
    }

    const candidate =
      await prisma.candidate.findUnique({
        where: {
          id: Number(candidateId),
        },
      });

    if (!candidate) {
      return res.status(404).json({
        message:
          "Candidate not found",
      });
    }

    const job =
      await prisma.job.findUnique({
        where: {
          id: Number(jobId),
        },
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const application =
      await prisma.application.create({
        data: {
          candidateId:
            Number(candidateId),

          jobId: Number(jobId),

          stage:
            stage || "Applied",

          status:
            status || "Active",
        },
      });

    res.status(201).json({
      ...application,
      candidate,
      job,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create application",
    });
  }
});

/* =========================================================
   UPDATE APPLICATION
========================================================= */

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message:
          "Invalid application ID",
      });
    }

    const existing =
      await prisma.application.findUnique({
        where: { id },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    const {
      stage,
      status,
    } = req.body;

    const data: {
      stage?: string;
      status?: string;
    } = {};

    if (stage !== undefined) {
      data.stage = stage;
    }

    if (status !== undefined) {
      data.status = status;
    }

    const application =
      await prisma.application.update({
        where: { id },
        data,
      });

    const candidate =
      await prisma.candidate.findUnique({
        where: {
          id: application.candidateId,
        },
      });

    const job =
      await prisma.job.findUnique({
        where: {
          id: application.jobId,
        },
      });

    res.json({
      ...application,
      candidate,
      job,
    });
  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update application",
    });
  }
});

/* =========================================================
   DELETE APPLICATION
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message:
          "Invalid application ID",
      });
    }

    const existing =
      await prisma.application.findUnique({
        where: { id },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    await prisma.application.delete({
      where: { id },
    });

    res.json({
      message:
        "Application deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete application error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete application",
    });
  }
});

export default router;
import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/* GET ALL JOBS */

router.get("/", async (_req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
});

/* CREATE JOB */

router.post("/", async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employment,
      salary,
      description,
    } = req.body;

    if (
      !title ||
      !department ||
      !location ||
      !employment ||
      !salary
    ) {
      return res.status(400).json({
        message:
          "Title, department, location, employment and salary are required",
      });
    }

    const job = await prisma.job.create({
      data: {
        title: String(title),
        department: String(department),
        location: String(location),
        employment: String(employment),
        salary: String(salary),
        description: description ? String(description) : "",
        status: "Active",
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
});

/* GET JOB */

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
});

/* UPDATE JOB */

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await prisma.job.update({
      where: { id },
      data: req.body,
    });

    res.json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
});

/* DELETE JOB */

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    await prisma.job.delete({
      where: { id },
    });

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete job",
    });
  }
});

export default router;
import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/* GET ALL CANDIDATES */

router.get("/", async (_req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(candidates);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch candidates",
    });
  }
});

/* CREATE CANDIDATE */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      experience,
      skills,
      resumeUrl,
      status,
    } = req.body;

    if (!name || !email || !skills) {
      return res.status(400).json({
        message: "Name, email and skills are required",
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : null,
        location: location ? String(location) : null,
        experience: experience ? String(experience) : null,
        skills: String(skills),
        resumeUrl: resumeUrl ? String(resumeUrl) : null,
        status: status ? String(status) : "Applied",
      },
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create candidate",
    });
  }
});

/* GET CANDIDATE */

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid candidate ID",
      });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.json(candidate);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch candidate",
    });
  }
});

/* UPDATE CANDIDATE */

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const candidate = await prisma.candidate.update({
      where: { id },
      data: req.body,
    });

    res.json(candidate);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update candidate",
    });
  }
});

/* DELETE CANDIDATE */

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.candidate.delete({
      where: { id },
    });

    res.json({
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete candidate",
    });
  }
});

export default router;
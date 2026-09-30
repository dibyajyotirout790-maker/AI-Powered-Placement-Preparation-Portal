const express = require("express");

const Job = require("../models/Job");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL JOBS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      message: "Failed to get jobs"
    });
  }
});


// ==========================================
// GET SINGLE JOB
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get job"
    });
  }
});


// ==========================================
// CREATE JOB
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create jobs"
      });
    }

    const {
      company,
      title,
      location,
      description,
      skills,
      package: salaryPackage,
      eligibility,
      deadline
    } = req.body;

    if (!company || !title || !description) {
      return res.status(400).json({
        message: "Company, title and description are required"
      });
    }

    const job = await Job.create({
      company,
      title,
      location,
      description,
      skills,
      package: salaryPackage,
      eligibility,
      deadline
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      message: "Failed to create job"
    });
  }
});


// ==========================================
// APPLY FOR JOB
// ==========================================

router.post(
  "/:id/apply",
  authMiddleware,
  async (req, res) => {

    try {

      if (req.user.role !== "student") {
        return res.status(403).json({
          message: "Only students can apply for jobs"
        });
      }

      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          message: "Job not found"
        });
      }

      // Check duplicate application
      const existingApplication =
        await Application.findOne({
          student: req.user.id,
          job: req.params.id
        });

      if (existingApplication) {
        return res.status(400).json({
          message: "You have already applied for this job"
        });
      }

      const application = await Application.create({
        student: req.user.id,
        job: req.params.id
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application
      });

    } catch (error) {

      console.error("Application error:", error);

      res.status(500).json({
        message: "Failed to apply for job"
      });
    }
  }
);


// ==========================================
// MY APPLICATIONS
// ==========================================

router.get(
  "/applications/my",
  authMiddleware,
  async (req, res) => {

    try {

      const applications =
        await Application.find({
          student: req.user.id
        })
        .populate("job")
        .sort({ createdAt: -1 });

      res.json(applications);

    } catch (error) {

      console.error(
        "Get applications error:",
        error
      );

      res.status(500).json({
        message: "Failed to get applications"
      });
    }
  }
);


module.exports = router;
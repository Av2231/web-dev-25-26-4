const express = require("express");
const router = express.Router();
const AppDataSource = require("../config/database");
const Subject = require("../entities/Subject");
const Student = require("../entities/Student");

const subjectRepo = AppDataSource.getRepository("Subject");

router.post("/", async (req, res) => {
  try {
    const { name, code, credits } = req.body;

    if (!name || !code || !credits) {
      return res.status(400).json({ error: "name, code, and credits are required" });
    }

    const existing = await subjectRepo.findOne({ where: { code } });
    if (existing) return res.status(400).json({ error: "Subject code must be unique" });

    const newSubject = subjectRepo.create({ name, code, credits });
    await subjectRepo.save(newSubject);

    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const subjects = await subjectRepo.find({ relations: ["students"] });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subject = await subjectRepo.findOne({
      where: { id: req.params.id },
      relations: ["students"],
    });

    if (!subject) return res.status(404).json({ error: "Subject not found" });

    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const subject = await subjectRepo.findOne({ where: { id: req.params.id } });
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    subjectRepo.merge(subject, req.body);
    await subjectRepo.save(subject);

    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const subject = await subjectRepo.findOne({ where: { id: req.params.id } });
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    await subjectRepo.remove(subject);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

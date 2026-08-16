const { Application, Job, User, Profile } = require('../models');
const { uploadResume } = require('../config/cloud');
const { computeMatchScore } = require('../services/matchService');
const { sendEmail, templates } = require('../services/emailService');

// POST /api/applications/:jobId  (seeker)
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job || job.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Job not available' });
    }

    const existing = await Application.findOne({
      where: { job_id: job.id, seeker_id: req.user.id },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already applied to this job' });
    }

    let resumeUrl;
    if (req.file) {
      resumeUrl = await uploadResume(req.file.buffer, `${req.user.id}-${Date.now()}`);
    } else {
      const profile = await Profile.findOne({ where: { user_id: req.user.id } });
      resumeUrl = profile?.resume_url;
    }
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'No resume found. Upload one to apply.' });
    }

    const profile = await Profile.findOne({ where: { user_id: req.user.id } });
    const matchScore = profile ? await computeMatchScore(profile, job) : null;

    const application = await Application.create({
      job_id: job.id,
      seeker_id: req.user.id,
      resume_url: resumeUrl,
      cover_note: req.body.cover_note || null,
      match_score: matchScore,
    });

    const { subject, html } = templates.applicationReceived(job);
    sendEmail({ to: req.user.email, subject, html }); // fire-and-forget

    res.status(201).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/me  (seeker's own applications)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { seeker_id: req.user.id },
      include: [{ model: Job, attributes: ['id', 'title', 'location', 'status'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/job/:jobId  (employer - applicants for one of their jobs)
const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.findAll({
      where: { job_id: req.params.jobId },
      include: [{ model: User, as: 'seeker', attributes: ['id', 'name', 'email'] }],
      order: [['match_score', 'DESC']],
    });
    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id/status  (employer - update status)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findByPk(req.params.id, { include: [Job] });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.Job.employer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    const seeker = await User.findByPk(application.seeker_id);
    const { subject, html } = templates.statusUpdate(application.Job, status);
    sendEmail({ to: seeker.email, subject, html }); // fire-and-forget

    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

module.exports = { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus };

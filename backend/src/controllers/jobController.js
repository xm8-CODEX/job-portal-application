const { Job, User, Profile } = require('../models');
const { buildJobSearchQuery, paginate } = require('../services/searchService');
const { computeMatchScore } = require('../services/matchService');

// POST /api/jobs  (employer)
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, employer_id: req.user.id });
    res.status(201).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs  (public search/listing, with optional match scores for logged-in seekers)
const getJobs = async (req, res, next) => {
  try {
    const where = buildJobSearchQuery(req.query);
    const { limit, offset } = paginate(req.query);

    const { rows: jobs, count } = await Job.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'employer', attributes: ['id', 'name', 'company_name'] }],
    });

    // If a logged-in seeker is browsing, attach a match score per job
    let results = jobs;
    if (req.user && req.user.role === 'seeker') {
      const profile = await Profile.findOne({ where: { user_id: req.user.id } });
      results = await Promise.all(
        jobs.map(async (job) => {
          const score = profile ? await computeMatchScore(profile, job) : null;
          return { ...job.toJSON(), match_score: score };
        })
      );
    }

    res.json({ success: true, count, page: Number(req.query.page) || 1, jobs: results });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, as: 'employer', attributes: ['id', 'name', 'company_name'] }],
    });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// PUT /api/jobs/:id  (employer - own jobs only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this job' });
    }
    await job.update(req.body);
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/jobs/:id  (employer - own jobs only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }
    await job.destroy();
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/employer/mine  (employer's own postings)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { employer_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs };

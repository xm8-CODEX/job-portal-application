const { Job, User, Application } = require('../models');

// GET /api/admin/jobs/pending
const getPendingJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'employer', attributes: ['id', 'name', 'company_name'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/jobs/:id/moderate  { status: 'approved' | 'rejected' }
const moderateJob = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    job.status = status;
    await job.save();
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.destroy();
    res.json({ success: true, message: 'User removed' });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, jobsByStatus] = await Promise.all([
      User.count(),
      Job.count(),
      Application.count(),
      Job.findAll({ attributes: ['status', [Job.sequelize.fn('COUNT', 'id'), 'count']], group: ['status'] }),
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalJobs,
        totalApplications,
        jobsByStatus,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPendingJobs, moderateJob, getAllUsers, deleteUser, getAnalytics };

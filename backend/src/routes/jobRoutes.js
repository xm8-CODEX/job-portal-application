const express = require('express');
const router = express.Router();
const {
  createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs,
} = require('../controllers/jobController');
const { jobValidator } = require('../utils/validators');
const { verifyToken, authorize } = require('../middleware/auth');

// Optional-auth wrapper: attaches req.user if a valid token is present,
// but does not block the request if not (used for public browsing with
// personalized match scores when logged in).
const optionalAuth = async (req, res, next) => {
  if (!req.headers.authorization) return next();
  return verifyToken(req, res, next);
};

router.get('/', optionalAuth, getJobs);
router.get('/employer/mine', verifyToken, authorize('employer'), getMyJobs);
router.get('/:id', getJobById);

router.post('/', verifyToken, authorize('employer'), jobValidator, createJob);
router.put('/:id', verifyToken, authorize('employer'), updateJob);
router.delete('/:id', verifyToken, authorize('employer'), deleteJob);

module.exports = router;

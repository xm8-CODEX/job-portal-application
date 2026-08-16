const express = require('express');
const router = express.Router();
const {
  applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus,
} = require('../controllers/applicationController');
const { verifyToken, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:jobId', verifyToken, authorize('seeker'), upload.single('resume'), applyToJob);
router.get('/me', verifyToken, authorize('seeker'), getMyApplications);
router.get('/job/:jobId', verifyToken, authorize('employer'), getApplicationsForJob);
router.patch('/:id/status', verifyToken, authorize('employer'), updateApplicationStatus);

module.exports = router;

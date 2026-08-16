const { Op } = require('sequelize');

/**
 * Builds a Sequelize `where` clause from job search query params.
 * Supports keyword, location, salary range, job type.
 */
function buildJobSearchQuery({ keyword, location, minSalary, maxSalary, jobType }) {
  const where = { status: 'approved' };

  if (keyword) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
      { skills: { [Op.overlap]: [keyword] } },
    ];
  }

  if (location) {
    where.location = { [Op.iLike]: `%${location}%` };
  }

  if (jobType) {
    where.job_type = jobType;
  }

  if (minSalary) {
    where.salary_max = { [Op.gte]: Number(minSalary) };
  }

  if (maxSalary) {
    where.salary_min = { [Op.lte]: Number(maxSalary) };
  }

  return where;
}

/**
 * Basic pagination helper.
 */
function paginate({ page = 1, limit = 10 }) {
  const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
  return { limit: Number(limit), offset };
}

module.exports = { buildJobSearchQuery, paginate };

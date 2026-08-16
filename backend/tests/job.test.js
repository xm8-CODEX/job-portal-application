const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

let employerToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const res = await request(app).post('/api/auth/register').send({
    name: 'Acme Recruiter',
    email: 'recruiter@acme.com',
    password: 'password123',
    role: 'employer',
    company_name: 'Acme Corp',
  });
  employerToken = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Job API', () => {
  let jobId;

  test('POST /api/jobs creates a job as an employer', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        title: 'Backend Engineer',
        description: 'Build and maintain our API services.',
        skills: ['Node.js', 'PostgreSQL'],
        location: 'Remote',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.job.title).toBe('Backend Engineer');
    jobId = res.body.job.id;
  });

  test('POST /api/jobs rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/jobs').send({ title: 'No Auth Job' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/jobs/:id fetches a single job', async () => {
    const res = await request(app).get(`/api/jobs/${jobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.job.id).toBe(jobId);
  });

  test('PUT /api/jobs/:id updates a job the employer owns', async () => {
    const res = await request(app)
      .put(`/api/jobs/${jobId}`)
      .set('Authorization', `Bearer ${employerToken}`)
      .send({ title: 'Senior Backend Engineer' });

    expect(res.statusCode).toBe(200);
    expect(res.body.job.title).toBe('Senior Backend Engineer');
  });
});

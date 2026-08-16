/**
 * matchService.js
 *
 * Computes a match score between a candidate's profile and a job.
 *
 * Two modes:
 *  1. SKILL_OVERLAP (default, no external API needed) - Jaccard similarity
 *     between candidate skills and job required skills. Good enough for a
 *     working demo and free to run.
 *  2. EMBEDDING mode - if OPENAI_API_KEY is set, upgrade to semantic
 *     similarity using text embeddings + cosine similarity. This is the
 *     version worth mentioning on a resume.
 *
 * Swap modes via the USE_EMBEDDINGS env var so the rest of the app doesn't
 * need to change.
 */

const useEmbeddings = process.env.USE_EMBEDDINGS === 'true';

/**
 * Jaccard similarity between two skill arrays (case-insensitive).
 */
function skillOverlapScore(candidateSkills = [], jobSkills = []) {
  const a = new Set(candidateSkills.map((s) => s.toLowerCase().trim()));
  const b = new Set(jobSkills.map((s) => s.toLowerCase().trim()));
  if (a.size === 0 || b.size === 0) return 0;

  const intersection = new Set([...a].filter((skill) => b.has(skill)));
  const union = new Set([...a, ...b]);

  return intersection.size / union.size; // 0 to 1
}

/**
 * Cosine similarity between two equal-length numeric vectors.
 */
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

/**
 * Generates an embedding vector for a text string via OpenAI's API.
 * Requires OPENAI_API_KEY in env. Falls back gracefully if not configured.
 */
async function getEmbedding(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: text, model: 'text-embedding-3-small' }),
  });

  if (!response.ok) throw new Error(`Embedding request failed: ${response.statusText}`);
  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Main entry point: returns a 0-1 match score between a candidate profile
 * and a job posting.
 *
 * @param {{skills: string[], bio?: string, experience_years?: number}} profile
 * @param {{skills: string[], description: string, title: string}} job
 * @returns {Promise<number>}
 */
async function computeMatchScore(profile, job) {
  if (useEmbeddings) {
    try {
      const candidateText = `${profile.bio || ''} Skills: ${profile.skills.join(', ')}`;
      const jobText = `${job.title}. ${job.description} Required skills: ${job.skills.join(', ')}`;

      const [candidateVec, jobVec] = await Promise.all([
        getEmbedding(candidateText),
        getEmbedding(jobText),
      ]);

      return Math.max(0, cosineSimilarity(candidateVec, jobVec));
    } catch (err) {
      // Fall back to skill overlap if embeddings fail (e.g. no API key/quota)
      return skillOverlapScore(profile.skills, job.skills);
    }
  }

  return skillOverlapScore(profile.skills, job.skills);
}

module.exports = { computeMatchScore, skillOverlapScore, cosineSimilarity };

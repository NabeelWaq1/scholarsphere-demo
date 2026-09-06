const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { scoreScholarshipForStudent } = require('../utils/recommendationEngine');

const router = express.Router();

// Helper to format scholarship tags & documents
function formatScholarship(s, isSaved = false) {
  let tags = [];
  let requiredDocs = [];
  try {
    tags = typeof s.tags === 'string' ? JSON.parse(s.tags) : s.tags;
  } catch (e) {
    tags = [];
  }
  try {
    requiredDocs = typeof s.required_documents === 'string' ? JSON.parse(s.required_documents) : s.required_documents;
  } catch (e) {
    requiredDocs = [];
  }

  // Calculate days remaining
  const now = new Date();
  const deadlineDate = new Date(s.deadline);
  const diffTime = deadlineDate - now;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isClosingSoon = daysRemaining >= 0 && daysRemaining <= 30;

  return {
    ...s,
    tags,
    required_documents: requiredDocs,
    days_remaining: daysRemaining,
    is_closing_soon: isClosingSoon,
    is_saved: isSaved
  };
}

// GET /api/scholarships
// Optional query params: country, field, degree_level, funding_type, search
router.get('/', async (req, res) => {
  try {
    const { country, field, degree_level, funding_type, search } = req.query;

    const where = {};
    if (country && country !== 'All') {
      where.country = country;
    }
    if (field && field !== 'All') {
      where.OR = [
        { field_of_study: { contains: field } },
        { field_of_study: 'Any' }
      ];
    }
    if (degree_level && degree_level !== 'All') {
      where.degree_level = { in: [degree_level, 'Any'] };
    }
    if (funding_type && funding_type !== 'All') {
      where.funding_type = funding_type.toLowerCase();
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { provider: { contains: search } },
        { description: { contains: search } },
        { country: { contains: search } },
        { field_of_study: { contains: search } }
      ];
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: { deadline: 'asc' }
    });

    // Check saved status if authorization token provided
    let savedIds = new Set();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const saved = await prisma.savedScholarship.findMany({
          where: { student_id: decoded.id },
          select: { scholarship_id: true }
        });
        savedIds = new Set(saved.map(s => s.scholarship_id));
      } catch (e) {}
    }

    const formatted = scholarships.map(s => formatScholarship(s, savedIds.has(s.id)));
    res.json(formatted);
  } catch (error) {
    console.error('Fetch scholarships error:', error);
    res.status(500).json({ error: 'Failed to fetch scholarships.' });
  }
});

// POST /api/scholarships/recommendations (student only)
router.post('/recommendations', authenticate, requireRole('student'), async (req, res) => {
  try {
    const studentProfile = req.user.student_profile;
    if (!studentProfile) {
      return res.status(400).json({ error: 'Student profile not found.' });
    }

    const allScholarships = await prisma.scholarship.findMany({
      orderBy: { deadline: 'asc' }
    });

    const saved = await prisma.savedScholarship.findMany({
      where: { student_id: req.user.id },
      select: { scholarship_id: true }
    });
    const savedIds = new Set(saved.map(s => s.scholarship_id));

    const scored = allScholarships.map(s => {
      const scoring = scoreScholarshipForStudent(s, studentProfile);
      const formatted = formatScholarship(s, savedIds.has(s.id));
      return {
        ...formatted,
        ...scoring
      };
    });

    // Sort descending by match_score
    scored.sort((a, b) => b.match_score - a.match_score);

    res.json(scored);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to compute recommendations.' });
  }
});

// GET /api/scholarships/saved (student only)
router.get('/saved', authenticate, requireRole('student'), async (req, res) => {
  try {
    const savedRecords = await prisma.savedScholarship.findMany({
      where: { student_id: req.user.id },
      include: {
        scholarship: true
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = savedRecords.map(r => formatScholarship(r.scholarship, true));
    res.json(formatted);
  } catch (error) {
    console.error('Fetch saved scholarships error:', error);
    res.status(500).json({ error: 'Failed to fetch saved scholarships.' });
  }
});

// GET /api/scholarships/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const scholarship = await prisma.scholarship.findUnique({
      where: { id }
    });

    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found.' });
    }

    let isSaved = false;
    let scoringInfo = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const saved = await prisma.savedScholarship.findUnique({
          where: {
            student_id_scholarship_id: {
              student_id: decoded.id,
              scholarship_id: id
            }
          }
        });
        isSaved = !!saved;

        const studentProf = await prisma.studentProfile.findUnique({
          where: { user_id: decoded.id }
        });
        if (studentProf) {
          scoringInfo = scoreScholarshipForStudent(scholarship, studentProf);
        }
      } catch (e) {}
    }

    const formatted = {
      ...formatScholarship(scholarship, isSaved),
      scoring: scoringInfo
    };

    res.json(formatted);
  } catch (error) {
    console.error('Fetch scholarship by id error:', error);
    res.status(500).json({ error: 'Failed to fetch scholarship details.' });
  }
});

// POST /api/scholarships/:id/save
router.post('/:id/save', authenticate, requireRole('student'), async (req, res) => {
  try {
    const scholarshipId = parseInt(req.params.id);

    await prisma.savedScholarship.upsert({
      where: {
        student_id_scholarship_id: {
          student_id: req.user.id,
          scholarship_id: scholarshipId
        }
      },
      update: {},
      create: {
        student_id: req.user.id,
        scholarship_id: scholarshipId
      }
    });

    res.json({ success: true, message: 'Scholarship saved to your profile.' });
  } catch (error) {
    console.error('Save scholarship error:', error);
    res.status(500).json({ error: 'Failed to save scholarship.' });
  }
});

// DELETE /api/scholarships/:id/save
router.delete('/:id/save', authenticate, requireRole('student'), async (req, res) => {
  try {
    const scholarshipId = parseInt(req.params.id);

    await prisma.savedScholarship.deleteMany({
      where: {
        student_id: req.user.id,
        scholarship_id: scholarshipId
      }
    });

    res.json({ success: true, message: 'Scholarship removed from saved.' });
  } catch (error) {
    console.error('Unsave scholarship error:', error);
    res.status(500).json({ error: 'Failed to remove scholarship.' });
  }
});

module.exports = router;

const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/mentors
// Optional query params: category, country, field_of_study, search
router.get('/', async (req, res) => {
  try {
    const { category, country, field_of_study, search } = req.query;

    const where = {
      role: 'mentor',
      mentor_profile: { isNot: null }
    };

    const mentorProfileWhere = {};

    if (country && country !== 'All') {
      mentorProfileWhere.country = country;
    }
    if (field_of_study && field_of_study !== 'All') {
      mentorProfileWhere.field_of_study = field_of_study;
    }
    if (category && category !== 'All') {
      mentorProfileWhere.services = {
        some: {
          category: category
        }
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { headline: { contains: search } },
        {
          mentor_profile: {
            current_university: { contains: search }
          }
        },
        {
          mentor_profile: {
            scholarship_they_hold: { contains: search }
          }
        }
      ];
    }

    if (Object.keys(mentorProfileWhere).length > 0) {
      where.mentor_profile = {
        ...where.mentor_profile,
        ...mentorProfileWhere
      };
    }

    const mentors = await prisma.user.findMany({
      where,
      include: {
        mentor_profile: {
          include: {
            services: true,
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy: [
        { mentor_profile: { rating: 'desc' } },
        { mentor_profile: { total_reviews: 'desc' } }
      ]
    });

    // Check if requesting user is an authenticated student to annotate "first_session_free"
    let studentId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'student') {
          studentId = decoded.id;
        }
      } catch (e) {}
    }

    // Get prior sessions between this student and mentors
    let pastSessionsMap = new Map();
    if (studentId) {
      const priorSessions = await prisma.liveSession.findMany({
        where: {
          student_id: studentId,
          status: { not: 'cancelled' }
        },
        select: { mentor_id: true }
      });
      for (const s of priorSessions) {
        pastSessionsMap.set(s.mentor_id, (pastSessionsMap.get(s.mentor_id) || 0) + 1);
      }
    }

    const formatted = mentors.map((m) => {
      const p = m.mentor_profile;
      const prices = p.services.map((s) => s.price);
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 25;
      const serviceCategories = [...new Set(p.services.map((s) => s.category))];

      const hasHadSession = studentId ? (pastSessionsMap.get(m.id) || 0) > 0 : false;
      const firstSessionFree = studentId ? !hasHadSession : true;

      return {
        id: m.id,
        name: m.name,
        email: m.email,
        avatar_seed: m.avatar_seed,
        avatar_url: m.avatar_url,
        headline: m.headline,
        country_of_origin: m.country_of_origin,
        current_university: p.current_university,
        field_of_study: p.field_of_study,
        degree_level: p.degree_level,
        country: p.country,
        scholarship_they_hold: p.scholarship_they_hold,
        years_experience_mentoring: p.years_experience_mentoring,
        bio: p.bio,
        rating: p.rating,
        total_reviews: p.total_reviews,
        response_time_hours: p.response_time_hours,
        starting_price: startingPrice,
        service_categories: serviceCategories,
        first_session_free: firstSessionFree
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Fetch mentors error:', error);
    res.status(500).json({ error: 'Failed to fetch mentors.' });
  }
});

// GET /api/mentors/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const mentor = await prisma.user.findFirst({
      where: {
        id,
        role: 'mentor'
      },
      include: {
        mentor_profile: {
          include: {
            services: true,
            reviews: {
              orderBy: { created_at: 'desc' }
            }
          }
        }
      }
    });

    if (!mentor || !mentor.mentor_profile) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }

    res.json({
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      avatar_seed: mentor.avatar_seed,
      avatar_url: mentor.avatar_url,
      headline: mentor.headline,
      country_of_origin: mentor.country_of_origin,
      current_university: mentor.mentor_profile.current_university,
      field_of_study: mentor.mentor_profile.field_of_study,
      degree_level: mentor.mentor_profile.degree_level,
      country: mentor.mentor_profile.country,
      scholarship_they_hold: mentor.mentor_profile.scholarship_they_hold,
      years_experience_mentoring: mentor.mentor_profile.years_experience_mentoring,
      bio: mentor.mentor_profile.bio,
      rating: mentor.mentor_profile.rating,
      total_reviews: mentor.mentor_profile.total_reviews,
      response_time_hours: mentor.mentor_profile.response_time_hours,
      services: mentor.mentor_profile.services,
      reviews: mentor.mentor_profile.reviews
    });
  } catch (error) {
    console.error('Fetch mentor detail error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor profile.' });
  }
});

// GET /api/mentors/:id/live-sessions/eligibility (student only)
router.get('/:id/live-sessions/eligibility', authenticate, requireRole('student'), async (req, res) => {
  try {
    const mentorId = parseInt(req.params.id);

    // Verify mentor exists
    const mentor = await prisma.user.findFirst({
      where: { id: mentorId, role: 'mentor' },
      include: { mentor_profile: true }
    });

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }

    // Check count of previous live sessions between this student and this mentor
    const previousSessionsCount = await prisma.liveSession.count({
      where: {
        student_id: req.user.id,
        mentor_id: mentorId,
        status: { not: 'cancelled' }
      }
    });

    const isFree = previousSessionsCount === 0;
    const standardPrice = 25.0; // standard session price

    res.json({
      is_free_first_session: isFree,
      price: isFree ? 0.0 : standardPrice,
      previous_sessions_count: previousSessionsCount,
      mentor_name: mentor.name,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({ error: 'Failed to check session eligibility.' });
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Helper to format user response with stats
async function getUserWithStats(user) {
  let stats = {};

  if (user.role === 'student') {
    const savedCount = await prisma.savedScholarship.count({
      where: { student_id: user.id }
    });
    const sessionsCount = await prisma.liveSession.count({
      where: { student_id: user.id }
    });
    const bookingsCount = await prisma.booking.count({
      where: { student_id: user.id }
    });

    stats = {
      saved_scholarships_count: savedCount,
      live_sessions_count: sessionsCount,
      bookings_count: bookingsCount
    };
  } else if (user.role === 'mentor' && user.mentor_profile) {
    const servicesCount = await prisma.mentorService.count({
      where: { mentor_id: user.mentor_profile.id }
    });
    const reviewsCount = await prisma.review.count({
      where: { mentor_id: user.mentor_profile.id }
    });
    const sessionsCount = await prisma.liveSession.count({
      where: { mentor_id: user.id }
    });

    stats = {
      services_count: servicesCount,
      reviews_count: reviewsCount,
      live_sessions_count: sessionsCount
    };
  }

  // Parse JSON fields in student_profile if any
  let studentProfile = user.student_profile;
  if (studentProfile) {
    try {
      studentProfile = {
        ...studentProfile,
        preferred_countries: JSON.parse(studentProfile.preferred_countries || '[]'),
        interests: JSON.parse(studentProfile.interests || '[]')
      };
    } catch (e) {}
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_seed: user.avatar_seed,
    avatar_url: user.avatar_url,
    headline: user.headline,
    country_of_origin: user.country_of_origin,
    created_at: user.created_at,
    student_profile: studentProfile,
    mentor_profile: user.mentor_profile,
    stats
  };
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      country_of_origin,
      headline,
      // Student specific
      university,
      field_of_study,
      degree_level,
      gpa,
      graduation_year,
      budget_range,
      preferred_countries,
      bio,
      ielts_toefl_score,
      interests,
      // Mentor specific
      current_university,
      scholarship_they_hold,
      years_experience_mentoring
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const avatar_seed = name.replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);

    let createdUser;

    if (role === 'student') {
      const countriesArr = Array.isArray(preferred_countries) ? preferred_countries : ['Germany', 'UK', 'Canada'];
      const interestsArr = Array.isArray(interests) ? interests : ['Scholarships', 'Global Education'];

      createdUser = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password_hash,
          role: 'student',
          avatar_seed,
          headline: headline || `${field_of_study || 'Student'} @ ${university || 'University'} | Aspiring International Scholar`,
          country_of_origin: country_of_origin || 'Pakistan',
          student_profile: {
            create: {
              university: university || 'International University',
              field_of_study: field_of_study || 'Computer Science',
              degree_level: degree_level || 'graduate',
              gpa: parseFloat(gpa) || 3.5,
              graduation_year: parseInt(graduation_year) || 2024,
              budget_range: budget_range || 'Fully funded only',
              preferred_countries: JSON.stringify(countriesArr),
              bio: bio || 'Excited to explore scholarships and mentorship on ScholarSphere.',
              ielts_toefl_score: ielts_toefl_score || null,
              interests: JSON.stringify(interestsArr)
            }
          }
        },
        include: {
          student_profile: true,
          mentor_profile: true
        }
      });
    } else {
      createdUser = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password_hash,
          role: 'mentor',
          avatar_seed,
          headline: headline || `${scholarship_they_hold || 'Scholar'} | ${current_university || 'International University'}`,
          country_of_origin: country_of_origin || 'Pakistan',
          mentor_profile: {
            create: {
              current_university: current_university || 'Top University Abroad',
              field_of_study: field_of_study || 'Engineering',
              degree_level: degree_level || 'graduate',
              country: country_of_origin || 'Germany',
              scholarship_they_hold: scholarship_they_hold || 'International Prestigious Scholarship',
              years_experience_mentoring: parseInt(years_experience_mentoring) || 2,
              bio: bio || 'Passionate mentor helping ambitious students succeed in scholarship admissions.',
              rating: 5.0,
              total_reviews: 0,
              response_time_hours: 24,
              services: {
                create: [
                  {
                    title: '1:1 Application & SOP Review',
                    category: 'SOP review',
                    price: 30.0,
                    delivery_time_days: 3,
                    description: 'Comprehensive review of your statement of purpose with actionable tips.'
                  }
                ]
              }
            }
          }
        },
        include: {
          student_profile: true,
          mentor_profile: true
        }
      });
    }

    // Add welcome notification
    await prisma.notification.create({
      data: {
        user_id: createdUser.id,
        type: 'session_reminder',
        message: `Welcome to ScholarSphere, ${createdUser.name}! Your ${createdUser.role} profile is now active.`
      }
    });

    const token = jwt.sign({ id: createdUser.id, email: createdUser.email, role: createdUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const userPayload = await getUserWithStats(createdUser);

    res.status(201).json({ token, user: userPayload });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        student_profile: true,
        mentor_profile: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userPayload = await getUserWithStats(user);

    res.json({ token, user: userPayload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const userPayload = await getUserWithStats(req.user);
    res.json(userPayload);
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

module.exports = router;

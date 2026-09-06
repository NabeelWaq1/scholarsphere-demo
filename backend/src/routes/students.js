const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// PUT /api/students/profile
router.put('/profile', authenticate, requireRole('student'), async (req, res) => {
  try {
    const {
      name,
      headline,
      country_of_origin,
      university,
      field_of_study,
      degree_level,
      gpa,
      graduation_year,
      budget_range,
      preferred_countries,
      bio,
      ielts_toefl_score,
      interests
    } = req.body;

    const countriesArr = Array.isArray(preferred_countries)
      ? preferred_countries
      : typeof preferred_countries === 'string'
      ? preferred_countries.split(',').map((c) => c.trim()).filter(Boolean)
      : ['Germany', 'Canada'];

    const interestsArr = Array.isArray(interests)
      ? interests
      : typeof interests === 'string'
      ? interests.split(',').map((i) => i.trim()).filter(Boolean)
      : ['Scholarships'];

    // Update user table
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || req.user.name,
        headline: headline || req.user.headline,
        country_of_origin: country_of_origin || req.user.country_of_origin,
        student_profile: {
          upsert: {
            create: {
              university: university || 'University',
              field_of_study: field_of_study || 'Computer Science',
              degree_level: degree_level || 'graduate',
              gpa: parseFloat(gpa) || 3.5,
              graduation_year: parseInt(graduation_year) || 2024,
              budget_range: budget_range || 'Fully funded only',
              preferred_countries: JSON.stringify(countriesArr),
              bio: bio || '',
              ielts_toefl_score: ielts_toefl_score || null,
              interests: JSON.stringify(interestsArr)
            },
            update: {
              university: university || undefined,
              field_of_study: field_of_study || undefined,
              degree_level: degree_level || undefined,
              gpa: gpa !== undefined ? parseFloat(gpa) : undefined,
              graduation_year: graduation_year !== undefined ? parseInt(graduation_year) : undefined,
              budget_range: budget_range || undefined,
              preferred_countries: JSON.stringify(countriesArr),
              bio: bio !== undefined ? bio : undefined,
              ielts_toefl_score: ielts_toefl_score !== undefined ? ielts_toefl_score : undefined,
              interests: JSON.stringify(interestsArr)
            }
          }
        }
      },
      include: {
        student_profile: true
      }
    });

    let profile = updatedUser.student_profile;
    if (profile) {
      try {
        profile = {
          ...profile,
          preferred_countries: JSON.parse(profile.preferred_countries || '[]'),
          interests: JSON.parse(profile.interests || '[]')
        };
      } catch (e) {}
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar_seed: updatedUser.avatar_seed,
        headline: updatedUser.headline,
        country_of_origin: updatedUser.country_of_origin,
        student_profile: profile
      }
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;

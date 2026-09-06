const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/connections/request (student sends connection request)
router.post('/request', authenticate, requireRole('student'), async (req, res) => {
  try {
    const { mentor_id, message } = req.body;
    if (!mentor_id) {
      return res.status(400).json({ error: 'Mentor ID is required.' });
    }

    const mentorIdInt = parseInt(mentor_id);
    const mentor = await prisma.user.findFirst({
      where: { id: mentorIdInt, role: 'mentor' }
    });

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }

    // Check if connection already exists
    const existing = await prisma.connection.findUnique({
      where: {
        student_id_mentor_id: {
          student_id: req.user.id,
          mentor_id: mentorIdInt
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        error: `Connection request already exists with status: ${existing.status}`,
        connection: existing
      });
    }

    const connection = await prisma.connection.create({
      data: {
        student_id: req.user.id,
        mentor_id: mentorIdInt,
        status: 'pending',
        message: message || null
      }
    });

    // Notify mentor
    await prisma.notification.create({
      data: {
        user_id: mentorIdInt,
        type: 'connection_requested',
        message: `${req.user.name} sent you a connection request: "${message ? message.slice(0, 80) : 'Looking forward to connecting!'}"`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully!',
      connection
    });
  } catch (error) {
    console.error('Connection request error:', error);
    res.status(500).json({ error: 'Failed to send connection request.' });
  }
});

// GET /api/connections/mine (student view of all connections)
router.get('/mine', authenticate, requireRole('student'), async (req, res) => {
  try {
    const connections = await prisma.connection.findMany({
      where: { student_id: req.user.id },
      include: {
        mentor: {
          include: { mentor_profile: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = connections.map((c) => ({
      id: c.id,
      status: c.status,
      message: c.message,
      created_at: c.created_at,
      responded_at: c.responded_at,
      mentor: {
        id: c.mentor.id,
        name: c.mentor.name,
        avatar_url: c.mentor.avatar_url,
        avatar_seed: c.mentor.avatar_seed,
        headline: c.mentor.headline,
        country: c.mentor.mentor_profile?.country || c.mentor.country_of_origin,
        current_university: c.mentor.mentor_profile?.current_university || 'University',
        scholarship_they_hold: c.mentor.mentor_profile?.scholarship_they_hold || '',
        field_of_study: c.mentor.mentor_profile?.field_of_study || '',
        rating: c.mentor.mentor_profile?.rating || 5.0,
        total_reviews: c.mentor.mentor_profile?.total_reviews || 0
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch student connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connections.' });
  }
});

// GET /api/connections/mentor-view (mentor view of incoming requests)
router.get('/mentor-view', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const connections = await prisma.connection.findMany({
      where: { mentor_id: req.user.id },
      include: {
        student: {
          include: { student_profile: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = connections.map((c) => ({
      id: c.id,
      status: c.status,
      message: c.message,
      created_at: c.created_at,
      responded_at: c.responded_at,
      student: {
        id: c.student.id,
        name: c.student.name,
        email: c.student.email,
        avatar_url: c.student.avatar_url,
        avatar_seed: c.student.avatar_seed,
        headline: c.student.headline,
        country: c.student.country_of_origin,
        university: c.student.student_profile?.university || 'University',
        gpa: c.student.student_profile?.gpa || null,
        field_of_study: c.student.student_profile?.field_of_study || null,
        degree_level: c.student.student_profile?.degree_level || null
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch mentor connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connection requests.' });
  }
});

// POST /api/connections/:id/respond (mentor accepts or declines request)
router.post('/:id/respond', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { action } = req.body; // 'accepted' | 'declined'

    if (!['accepted', 'declined'].includes(action)) {
      return res.status(400).json({ error: "Action must be 'accepted' or 'declined'." });
    }

    const connection = await prisma.connection.findUnique({
      where: { id },
      include: {
        mentor: true,
        student: true
      }
    });

    if (!connection || connection.mentor_id !== req.user.id) {
      return res.status(404).json({ error: 'Connection request not found or unauthorized.' });
    }

    const updated = await prisma.connection.update({
      where: { id },
      data: {
        status: action,
        responded_at: new Date()
      }
    });

    if (action === 'accepted') {
      // Notify student
      await prisma.notification.create({
        data: {
          user_id: connection.student_id,
          type: 'connection_accepted',
          message: `${connection.mentor.name} accepted your connection request — you can now book a 1:1 live strategy session!`
        }
      });
    }

    res.json({
      success: true,
      message: `Connection request ${action}.`,
      connection: updated
    });
  } catch (error) {
    console.error('Respond connection error:', error);
    res.status(500).json({ error: 'Failed to update connection request.' });
  }
});

// GET /api/connections/status/:mentorId (check connection status with mentor)
router.get('/status/:mentorId', authenticate, requireRole('student'), async (req, res) => {
  try {
    const mentorId = parseInt(req.params.mentorId);

    const connection = await prisma.connection.findUnique({
      where: {
        student_id_mentor_id: {
          student_id: req.user.id,
          mentor_id: mentorId
        }
      }
    });

    res.json({
      status: connection ? connection.status : 'none',
      connection: connection || null,
      can_book_live_session: connection?.status === 'accepted'
    });
  } catch (error) {
    console.error('Check connection status error:', error);
    res.status(500).json({ error: 'Failed to check connection status.' });
  }
});

module.exports = router;

const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Sample placeholder video for fake recordings
const SAMPLE_RECORDING_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// POST /api/live-sessions (request a live session)
router.post('/', authenticate, requireRole('student'), async (req, res) => {
  try {
    const { mentor_id, scheduled_datetime, duration_minutes, title, payment_id } = req.body;

    if (!mentor_id || !scheduled_datetime) {
      return res.status(400).json({ error: 'Mentor ID and scheduled date/time are required.' });
    }

    const mentorIdInt = parseInt(mentor_id);
    const duration = parseInt(duration_minutes) === 60 ? 60 : 30;

    const mentor = await prisma.user.findFirst({
      where: { id: mentorIdInt, role: 'mentor' },
      include: { mentor_profile: true }
    });

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }

    // REQUIREMENT: Must have an accepted connection before requesting a live session!
    const connection = await prisma.connection.findUnique({
      where: {
        student_id_mentor_id: {
          student_id: req.user.id,
          mentor_id: mentorIdInt
        }
      }
    });

    if (!connection || connection.status !== 'accepted') {
      return res.status(403).json({
        error: `An accepted connection with ${mentor.name} is required before booking a live session. Current status: ${connection ? connection.status : 'no connection'}.`,
        connection_required: true,
        connection_status: connection ? connection.status : 'none'
      });
    }

    // BACKEND BUSINESS RULE ENFORCEMENT:
    // Check previous sessions count (status != 'cancelled' and status != 'declined')
    const previousSessionsCount = await prisma.liveSession.count({
      where: {
        student_id: req.user.id,
        mentor_id: mentorIdInt,
        status: { in: ['confirmed', 'completed', 'requested'] }
      }
    });

    const isFirstSession = previousSessionsCount === 0;
    let price = 0.0;
    let paymentStatus = 'not_required';

    if (isFirstSession) {
      // First session is free!
      price = 0.0;
      paymentStatus = 'not_required';
    } else {
      // Subsequent session requires fake payment first!
      const standardPrice = duration === 60 ? 35.0 : 25.0;
      price = standardPrice;

      if (!payment_id) {
        return res.status(400).json({
          error: 'Payment required for subsequent live sessions with this mentor.',
          requires_payment: true,
          amount: standardPrice,
          is_free_first_session: false
        });
      }

      // Verify payment record
      const payment = await prisma.payment.findUnique({
        where: { id: parseInt(payment_id) }
      });

      if (!payment || payment.user_id !== req.user.id || payment.status !== 'success') {
        return res.status(400).json({ error: 'Valid completed payment record is required.' });
      }

      paymentStatus = 'paid';
    }

    // NEW STATUS FLOW: Session goes in as 'requested' (awaits mentor approval)
    const session = await prisma.liveSession.create({
      data: {
        mentor_id: mentorIdInt,
        student_id: req.user.id,
        title: title || (isFirstSession ? 'Free 1:1 Strategy Call' : `1:1 Live Mentorship Session (${duration}m)`),
        scheduled_datetime: new Date(scheduled_datetime),
        duration_minutes: duration,
        status: 'requested', // requires mentor approval!
        is_free_first_session: isFirstSession,
        price,
        payment_status: paymentStatus
      },
      include: {
        mentor: {
          include: { mentor_profile: true }
        }
      }
    });

    // Link payment record if paid
    if (payment_id) {
      await prisma.payment.update({
        where: { id: parseInt(payment_id) },
        data: {
          related_type: 'live_session',
          related_id: session.id
        }
      });
    }

    // Notifications
    const dateFormatted = new Date(scheduled_datetime).toLocaleString();
    await prisma.notification.create({
      data: {
        user_id: req.user.id,
        type: 'session_requested',
        message: `Your ${isFirstSession ? 'FREE ' : ''}session request with ${mentor.name} for ${dateFormatted} was submitted and is pending mentor approval.`
      }
    });

    await prisma.notification.create({
      data: {
        user_id: mentorIdInt,
        type: 'session_requested',
        message: `New session request from ${req.user.name} (${dateFormatted}) awaiting your approval.`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Live session requested! Waiting for mentor approval.',
      session
    });
  } catch (error) {
    console.error('Book live session error:', error);
    res.status(500).json({ error: 'Failed to schedule live session.' });
  }
});

// POST /api/live-sessions/:id/approve (mentor approves requested session)
router.post('/:id/approve', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { student: true, mentor: true }
    });

    if (!session || session.mentor_id !== req.user.id) {
      return res.status(404).json({ error: 'Session not found or unauthorized.' });
    }

    const updated = await prisma.liveSession.update({
      where: { id: sessionId },
      data: { status: 'confirmed' },
      include: { recording: true }
    });

    const dateFormatted = new Date(session.scheduled_datetime).toLocaleString();
    await prisma.notification.create({
      data: {
        user_id: session.student_id,
        type: 'session_confirmed',
        message: `${session.mentor.name} confirmed your live session for ${dateFormatted}!`
      }
    });

    res.json({ success: true, message: 'Session confirmed successfully!', session: updated });
  } catch (error) {
    console.error('Approve session error:', error);
    res.status(500).json({ error: 'Failed to approve session.' });
  }
});

// POST /api/live-sessions/:id/decline (mentor declines requested session)
router.post('/:id/decline', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { student: true, mentor: true }
    });

    if (!session || session.mentor_id !== req.user.id) {
      return res.status(404).json({ error: 'Session not found or unauthorized.' });
    }

    const updated = await prisma.liveSession.update({
      where: { id: sessionId },
      data: { status: 'declined' }
    });

    await prisma.notification.create({
      data: {
        user_id: session.student_id,
        type: 'session_reminder',
        message: `${session.mentor.name} declined your live session request.`
      }
    });

    res.json({ success: true, message: 'Session declined.', session: updated });
  } catch (error) {
    console.error('Decline session error:', error);
    res.status(500).json({ error: 'Failed to decline session.' });
  }
});

// POST /api/live-sessions/:id/complete (marks session completed and generates recording)
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { recording: true, mentor: true, student: true }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    // Verify requesting user is student or mentor of this session
    if (session.student_id !== req.user.id && session.mentor_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to complete this session.' });
    }

    // Update status to completed
    const updated = await prisma.liveSession.update({
      where: { id: sessionId },
      data: { status: 'completed' }
    });

    // Generate SessionRecording if doesn't exist
    let recording = session.recording;
    if (!recording) {
      recording = await prisma.sessionRecording.create({
        data: {
          live_session_id: sessionId,
          video_url: SAMPLE_RECORDING_VIDEO,
          duration_minutes: session.duration_minutes || 30,
          thumbnail_url: session.mentor.avatar_url || '/campuses/general.jpg'
        }
      });
    }

    res.json({
      success: true,
      message: 'Session completed and recording generated.',
      session: updated,
      recording
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Failed to complete session.' });
  }
});

// GET /api/live-sessions/mine (student view)
router.get('/mine', authenticate, requireRole('student'), async (req, res) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: { student_id: req.user.id },
      include: {
        mentor: {
          include: { mentor_profile: true }
        },
        recording: true
      },
      orderBy: { scheduled_datetime: 'desc' }
    });

    const now = new Date();
    const formatted = sessions.map((s) => {
      const isPast = new Date(s.scheduled_datetime) < now || s.status === 'completed';
      return {
        id: s.id,
        title: s.title,
        scheduled_datetime: s.scheduled_datetime,
        duration_minutes: s.duration_minutes,
        status: s.status,
        is_free_first_session: s.is_free_first_session,
        price: s.price,
        payment_status: s.payment_status,
        meeting_note: s.meeting_note,
        is_past: isPast,
        recording: s.recording,
        mentor: {
          id: s.mentor.id,
          name: s.mentor.name,
          avatar_url: s.mentor.avatar_url,
          avatar_seed: s.mentor.avatar_seed,
          headline: s.mentor.headline,
          current_university: s.mentor.mentor_profile ? s.mentor.mentor_profile.current_university : 'University',
          country: s.mentor.mentor_profile ? s.mentor.mentor_profile.country : 'Abroad',
          scholarship_they_hold: s.mentor.mentor_profile ? s.mentor.mentor_profile.scholarship_they_hold : ''
        }
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Fetch student sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch live sessions.' });
  }
});

// GET /api/live-sessions/mentor-view (mentor view)
router.get('/mentor-view', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: { mentor_id: req.user.id },
      include: {
        student: {
          include: { student_profile: true }
        },
        recording: true
      },
      orderBy: { scheduled_datetime: 'desc' }
    });

    const now = new Date();
    const formatted = sessions.map((s) => {
      const isPast = new Date(s.scheduled_datetime) < now || s.status === 'completed';
      return {
        id: s.id,
        title: s.title,
        scheduled_datetime: s.scheduled_datetime,
        duration_minutes: s.duration_minutes,
        status: s.status,
        is_free_first_session: s.is_free_first_session,
        price: s.price,
        payment_status: s.payment_status,
        meeting_note: s.meeting_note,
        is_past: isPast,
        recording: s.recording,
        student: {
          id: s.student.id,
          name: s.student.name,
          email: s.student.email,
          avatar_url: s.student.avatar_url,
          avatar_seed: s.student.avatar_seed,
          headline: s.student.headline,
          country: s.student.country_of_origin,
          university: s.student.student_profile ? s.student.student_profile.university : 'University',
          gpa: s.student.student_profile ? s.student.student_profile.gpa : null,
          field_of_study: s.student.student_profile ? s.student.student_profile.field_of_study : null
        }
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Fetch mentor sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor live sessions.' });
  }
});

// POST /api/live-sessions/:id/notes (mentor update meeting notes)
router.post('/:id/notes', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { meeting_note } = req.body;

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { recording: true, mentor: true }
    });

    if (!session || session.mentor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this session.' });
    }

    const updated = await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        meeting_note,
        status: 'completed'
      }
    });

    // Also auto-generate recording on completed
    if (!session.recording) {
      await prisma.sessionRecording.create({
        data: {
          live_session_id: sessionId,
          video_url: SAMPLE_RECORDING_VIDEO,
          duration_minutes: session.duration_minutes || 30,
          thumbnail_url: session.mentor.avatar_url || '/campuses/general.jpg'
        }
      });
    }

    // Notify student
    await prisma.notification.create({
      data: {
        user_id: session.student_id,
        type: 'session_reminder',
        message: `Meeting notes & session recording are now ready for "${session.title}".`
      }
    });

    res.json({ success: true, session: updated });
  } catch (error) {
    console.error('Save notes error:', error);
    res.status(500).json({ error: 'Failed to update meeting notes.' });
  }
});

module.exports = router;

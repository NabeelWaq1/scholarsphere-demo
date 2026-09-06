const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings (async service booking)
router.post('/', authenticate, requireRole('student'), async (req, res) => {
  try {
    const { service_id, notes, payment_id } = req.body;

    if (!service_id) {
      return res.status(400).json({ error: 'Service ID is required.' });
    }

    const service = await prisma.mentorService.findUnique({
      where: { id: parseInt(service_id) },
      include: {
        mentor: {
          include: {
            user: true
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Mentor service not found.' });
    }

    let paymentStatus = 'free';
    let amountPaid = 0.0;

    if (service.price > 0) {
      if (!payment_id) {
        return res.status(400).json({
          error: 'Payment required before confirming this service booking.',
          requires_payment: true,
          amount: service.price
        });
      }

      // Verify payment record exists
      const payment = await prisma.payment.findUnique({
        where: { id: parseInt(payment_id) }
      });

      if (!payment || payment.user_id !== req.user.id || payment.status !== 'success') {
        return res.status(400).json({ error: 'Valid completed payment record is required.' });
      }

      paymentStatus = 'paid';
      amountPaid = service.price;
    }

    const booking = await prisma.booking.create({
      data: {
        student_id: req.user.id,
        service_id: service.id,
        status: 'confirmed',
        payment_status: paymentStatus,
        amount_paid: amountPaid,
        notes: notes || null
      },
      include: {
        service: true
      }
    });

    // Update payment record if provided
    if (payment_id) {
      await prisma.payment.update({
        where: { id: parseInt(payment_id) },
        data: {
          related_type: 'service_booking',
          related_id: booking.id
        }
      });
    }

    // Notifications for student & mentor
    await prisma.notification.create({
      data: {
        user_id: req.user.id,
        type: 'booking_confirmed',
        message: `Your booking for "${service.title}" with ${service.mentor.user.name} is confirmed!`
      }
    });

    await prisma.notification.create({
      data: {
        user_id: service.mentor.user.id,
        type: 'booking_confirmed',
        message: `New booking received from ${req.user.name} for "${service.title}" ($${amountPaid.toFixed(2)}).`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Service booked successfully!',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create service booking.' });
  }
});

// GET /api/bookings/mine (student view)
router.get('/mine', authenticate, requireRole('student'), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { student_id: req.user.id },
      include: {
        service: {
          include: {
            mentor: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      title: b.service.title,
      category: b.service.category,
      price: b.service.price,
      amount_paid: b.amount_paid,
      delivery_time_days: b.service.delivery_time_days,
      status: b.status,
      payment_status: b.payment_status,
      notes: b.notes,
      created_at: b.created_at,
      mentor: {
        id: b.service.mentor.user.id,
        name: b.service.mentor.user.name,
        avatar_seed: b.service.mentor.user.avatar_seed,
        headline: b.service.mentor.user.headline,
        current_university: b.service.mentor.current_university,
        country: b.service.mentor.country
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch student bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// GET /api/bookings/mentor-view (mentor view)
router.get('/mentor-view', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    if (!req.user.mentor_profile) {
      return res.status(400).json({ error: 'Mentor profile missing.' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          mentor_id: req.user.mentor_profile.id
        }
      },
      include: {
        service: true,
        student: {
          include: {
            student_profile: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      service_title: b.service.title,
      category: b.service.category,
      amount_paid: b.amount_paid,
      status: b.status,
      payment_status: b.payment_status,
      notes: b.notes,
      created_at: b.created_at,
      student: {
        id: b.student.id,
        name: b.student.name,
        email: b.student.email,
        avatar_seed: b.student.avatar_seed,
        headline: b.student.headline,
        university: b.student.student_profile ? b.student.student_profile.university : 'University',
        country: b.student.country_of_origin
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch mentor bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor bookings.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

// 1. Student creates a service request
router.post('/', authenticate, requireRole('student'), async (req, res) => {
  const { title, category, description, budget_min, budget_max, deadline } = req.body;
  try {
    const request = await prisma.serviceRequest.create({
      data: {
        student_id: req.user.id,
        title,
        category,
        description,
        budget_min: parseFloat(budget_min),
        budget_max: parseFloat(budget_max),
        deadline: new Date(deadline),
      }
    });
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// 2. Browse all open requests
router.get('/', authenticate, async (req, res) => {
  const { category, sort } = req.query;
  
  const where = { status: 'open' };
  if (category) {
    where.category = category;
  }
  
  let orderBy = { created_at: 'desc' };
  if (sort === 'budget_high') {
    orderBy = { budget_max: 'desc' };
  } else if (sort === 'budget_low') {
    orderBy = { budget_max: 'asc' };
  }
  
  try {
    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
            avatar_seed: true,
            headline: true,
            country_of_origin: true,
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// 3. Student gets their own requests with applications
router.get('/mine', authenticate, requireRole('student'), async (req, res) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      where: { student_id: req.user.id },
      orderBy: { created_at: 'desc' },
      include: {
        applications: {
          include: {
            mentor: {
              select: {
                id: true,
                name: true,
                avatar_url: true,
                avatar_seed: true,
                headline: true,
              }
            }
          }
        }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your requests' });
  }
});

// 4. Mentor applies to a request
router.post('/:id/apply', authenticate, requireRole('mentor'), async (req, res) => {
  const { id } = req.params;
  const { proposed_price, message } = req.body;
  
  try {
    const request = await prisma.serviceRequest.findUnique({ where: { id: parseInt(id) } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    // Can't apply to own request - this shouldn't happen anyway since roles are split, but good to check
    if (request.student_id === req.user.id) return res.status(400).json({ error: 'Cannot apply to your own request' });
    
    // Can't apply twice
    const existing = await prisma.requestApplication.findFirst({
      where: { request_id: parseInt(id), mentor_id: req.user.id }
    });
    if (existing) return res.status(400).json({ error: 'You have already applied to this request' });
    
    const application = await prisma.requestApplication.create({
      data: {
        request_id: parseInt(id),
        mentor_id: req.user.id,
        proposed_price: parseFloat(proposed_price),
        message
      }
    });
    
    await prisma.notification.create({
      data: {
        user_id: request.student_id,
        type: 'new_application',
        message: `${req.user.name} applied to your request: "${request.title}"`
      }
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to apply to request' });
  }
});

// 5. Mentor gets their applications
router.get('/my-applications', authenticate, requireRole('mentor'), async (req, res) => {
  try {
    const applications = await prisma.requestApplication.findMany({
      where: { mentor_id: req.user.id },
      orderBy: { created_at: 'desc' },
      include: {
        request: {
          include: {
            student: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your applications' });
  }
});

// 6. Student accepts an application
router.post('/:id/applications/:appId/accept', authenticate, requireRole('student'), async (req, res) => {
  const { id, appId } = req.params;
  
  try {
    const request = await prisma.serviceRequest.findUnique({ where: { id: parseInt(id) } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.student_id !== req.user.id) return res.status(403).json({ error: 'Not your request' });
    
    const application = await prisma.requestApplication.findUnique({
      where: { id: parseInt(appId) },
      include: { mentor: true }
    });
    
    if (!application || application.request_id !== request.id) {
      return res.status(404).json({ error: 'Application not found for this request' });
    }
    
    // Accept this one, reject others
    await prisma.$transaction([
      prisma.requestApplication.updateMany({
        where: { request_id: request.id, id: { not: application.id } },
        data: { status: 'rejected' }
      }),
      prisma.requestApplication.update({
        where: { id: application.id },
        data: { status: 'accepted' }
      }),
      prisma.serviceRequest.update({
        where: { id: request.id },
        data: { status: 'in_progress' }
      })
    ]);
    
    // Find mentor profile for service
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { user_id: application.mentor_id },
      include: { services: true }
    });
    
    // Find matching service or create a temp one
    let service = mentorProfile.services.find(s => s.category === request.category);
    if (!service) {
      service = await prisma.mentorService.create({
        data: {
          mentor_id: mentorProfile.id,
          title: `Custom Service: ${request.title}`,
          category: request.category,
          price: application.proposed_price,
          delivery_time_days: 7,
          description: `Custom service created from request: ${request.title}`
        }
      });
    }
    
    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        student_id: req.user.id,
        service_id: service.id,
        status: 'confirmed',
        payment_status: 'paid', // Assume paid for demo
        amount_paid: application.proposed_price,
        notes: `From service request: ${request.title}`
      }
    });
    
    // Notifications
    await prisma.notification.create({
      data: {
        user_id: application.mentor_id,
        type: 'application_accepted',
        message: `${req.user.name} accepted your application for "${request.title}"`
      }
    });
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to accept application' });
  }
});

// 7. Student marks request completed
router.post('/:id/complete', authenticate, requireRole('student'), async (req, res) => {
  const { id } = req.params;
  try {
    const request = await prisma.serviceRequest.findUnique({ where: { id: parseInt(id) } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.student_id !== req.user.id) return res.status(403).json({ error: 'Not your request' });
    
    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'completed' }
    });
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete request' });
  }
});

module.exports = router;

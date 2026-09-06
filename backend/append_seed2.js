const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

const newData = `
  console.log('Seeding connections...');
  const studentAhmedUser = await prisma.user.findUnique({ where: { email: 'student.ahmed@demo.com' } });
  const studentFatimaUser = await prisma.user.findUnique({ where: { email: 'student.fatima@demo.com' } });
  const studentAliUser = await prisma.user.findUnique({ where: { email: 'student.ali@demo.com' } });
  const mentorSaraUser = await prisma.user.findUnique({ where: { email: 'mentor.sara@demo.com' } });
  const mentorHassanUser = await prisma.user.findUnique({ where: { email: 'mentor.hassan@demo.com' } });

  await prisma.connection.createMany({
    data: [
      { student_id: studentAhmedUser.id, mentor_id: mentorSaraUser.id, status: 'accepted', message: 'Hi Sara, I need DAAD guidance!' },
      { student_id: studentAhmedUser.id, mentor_id: mentorHassanUser.id, status: 'pending', message: 'Would love to discuss Chevening options too' },
      { student_id: studentFatimaUser.id, mentor_id: mentorHassanUser.id, status: 'accepted', message: 'Need Chevening essay help' },
      { student_id: studentFatimaUser.id, mentor_id: mentorSaraUser.id, status: 'pending' },
    ]
  });

  console.log('Seeding session recording and new sessions...');
  const ahmedSaraSession = await prisma.liveSession.findFirst({
    where: { student_id: studentAhmedUser.id, mentor_id: mentorSaraUser.id, status: 'completed' }
  });
  if (ahmedSaraSession) {
    await prisma.sessionRecording.create({
      data: {
        live_session_id: ahmedSaraSession.id,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration_minutes: 28,
        thumbnail_url: '/campuses/germany.jpg'
      }
    });
  }

  await prisma.liveSession.create({
    data: {
      mentor_id: mentorSaraUser.id,
      student_id: studentFatimaUser.id,
      title: 'Initial SOP Review Consultation',
      scheduled_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration_minutes: 30,
      status: 'requested',
      is_free_first_session: true,
      price: 0
    }
  });

  console.log('Seeding ServiceRequests...');
  const aliReq = await prisma.serviceRequest.create({
    data: {
      student_id: studentAliUser.id,
      title: 'Need help with SOP for Turkish government scholarship',
      category: 'SOP review',
      description: 'Looking for an experienced mentor to review my SOP.',
      budget_min: 20,
      budget_max: 40,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'open'
    }
  });
  
  const ahmedReq = await prisma.serviceRequest.create({
    data: {
      student_id: studentAhmedUser.id,
      title: 'DAAD scholarship application complete review',
      category: 'Scholarship application review',
      description: 'Please help me review the complete DAAD package.',
      budget_min: 30,
      budget_max: 50,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'open'
    }
  });

  await prisma.serviceRequest.create({
    data: {
      student_id: studentFatimaUser.id,
      title: 'Chevening interview preparation coaching',
      category: 'Interview prep',
      description: 'Need mock interviews for Chevening.',
      budget_min: 25,
      budget_max: 45,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'in_progress'
    }
  });

  const otherStudents = await prisma.user.findMany({ where: { role: 'student' }, skip: 3, take: 5 });
  for(let st of otherStudents) {
    await prisma.serviceRequest.create({
      data: {
        student_id: st.id,
        title: 'Need guidance for university shortlisting',
        category: 'University shortlisting',
        description: 'Help me find universities that fit my profile.',
        budget_min: 15,
        budget_max: 30,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'open'
      }
    });
  }

  console.log('Seeding RequestApplications...');
  await prisma.requestApplication.create({
    data: { request_id: aliReq.id, mentor_id: mentorSaraUser.id, proposed_price: 30, message: 'I can help you with this.' }
  });
  await prisma.requestApplication.create({
    data: { request_id: aliReq.id, mentor_id: mentorHassanUser.id, proposed_price: 35, message: 'I have experience with this.' }
  });
  
  const extraMentor = await prisma.user.findFirst({ where: { role: 'mentor', id: { notIn: [mentorSaraUser.id, mentorHassanUser.id] } } });
  if(extraMentor) {
    await prisma.requestApplication.create({
      data: { request_id: aliReq.id, mentor_id: extraMentor.id, proposed_price: 25, message: 'Ready to help.' }
    });
  }

  await prisma.requestApplication.create({
    data: { request_id: ahmedReq.id, mentor_id: mentorSaraUser.id, proposed_price: 45, message: 'I am a DAAD scholar!' }
  });

  console.log('Seeding Additional Notifications...');
  await prisma.notification.create({
    data: { user_id: studentAliUser.id, type: 'new_application', message: 'A mentor applied to your service request.' }
  });
  await prisma.notification.create({
    data: { user_id: mentorSaraUser.id, type: 'new_request', message: 'A new service request in your field was posted.' }
  });
`;

content = content.replace(/console\.log\('✅ Database seeded successfully!'\);/, newData + "\n  console.log('✅ Database seeded successfully!');");
// Since emojis sometimes get mangled, we'll try a regex that catches `Database seeded successfully!`
content = content.replace(/console\.log\('.*Database seeded successfully!.*'\);/, newData + "\n  console.log('✅ Database seeded successfully!');");

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Appended using fallback regex');

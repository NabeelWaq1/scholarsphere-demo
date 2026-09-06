const prisma = require('./src/db');

async function checkCounts() {
  const students = await prisma.user.count({ where: { role: 'student' } });
  const mentors = await prisma.user.count({ where: { role: 'mentor' } });
  const scholarships = await prisma.scholarship.count();
  const services = await prisma.mentorService.count();
  const reviews = await prisma.review.count();
  const liveSessions = await prisma.liveSession.count();
  const bookings = await prisma.booking.count();
  const notifications = await prisma.notification.count();
  const payments = await prisma.payment.count();

  console.log('--- DATABASE POPULATION AUDIT ---');
  console.log('Students count:', students, '(Target: 60)');
  console.log('Mentors count:', mentors, '(Target: 50)');
  console.log('Scholarships count:', scholarships, '(Target: 40)');
  console.log('Mentor Services count:', services);
  console.log('Reviews count:', reviews);
  console.log('Live Sessions count:', liveSessions);
  console.log('Async Bookings count:', bookings);
  console.log('Notifications count:', notifications);
  console.log('Payments count:', payments);

  const demoAhmed = await prisma.user.findUnique({
    where: { email: 'student.ahmed@demo.com' },
    include: { student_profile: true }
  });
  const demoFatima = await prisma.user.findUnique({
    where: { email: 'student.fatima@demo.com' },
    include: { student_profile: true }
  });
  const demoAli = await prisma.user.findUnique({
    where: { email: 'student.ali@demo.com' },
    include: { student_profile: true }
  });
  const demoSara = await prisma.user.findUnique({
    where: { email: 'mentor.sara@demo.com' },
    include: { mentor_profile: true }
  });
  const demoHassan = await prisma.user.findUnique({
    where: { email: 'mentor.hassan@demo.com' },
    include: { mentor_profile: true }
  });

  console.log('--- FIXED DEMO ACCOUNTS AUDIT ---');
  console.log('Ahmed found:', !!demoAhmed, 'GPA:', demoAhmed?.student_profile?.gpa, 'Field:', demoAhmed?.student_profile?.field_of_study);
  console.log('Fatima found:', !!demoFatima, 'GPA:', demoFatima?.student_profile?.gpa, 'Field:', demoFatima?.student_profile?.field_of_study);
  console.log('Ali found:', !!demoAli, 'GPA:', demoAli?.student_profile?.gpa, 'Field:', demoAli?.student_profile?.field_of_study);
  console.log('Sara found:', !!demoSara, 'Uni:', demoSara?.mentor_profile?.current_university, 'Scholarship:', demoSara?.mentor_profile?.scholarship_they_hold);
  console.log('Hassan found:', !!demoHassan, 'Uni:', demoHassan?.mentor_profile?.current_university, 'Scholarship:', demoHassan?.mentor_profile?.scholarship_they_hold);

  const ahmedSessions = await prisma.liveSession.count({ where: { student_id: demoAhmed.id } });
  const fatimaSessions = await prisma.liveSession.count({ where: { student_id: demoFatima.id } });
  const aliSessions = await prisma.liveSession.count({ where: { student_id: demoAli.id } });
  console.log(`Initial live sessions: Ahmed=${ahmedSessions}, Fatima=${fatimaSessions}, Ali=${aliSessions}`);

  await prisma.$disconnect();
}

checkCounts();

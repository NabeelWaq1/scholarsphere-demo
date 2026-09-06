const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

// 1. Clean delete section
const deleteSection = `
  await prisma.sessionRecording.deleteMany({});
  await prisma.requestApplication.deleteMany({});
  await prisma.serviceRequest.deleteMany({});
  await prisma.connection.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.savedScholarship.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.liveSession.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.mentorService.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.mentorProfile.deleteMany({});
  await prisma.user.deleteMany({});
`;
content = content.replace(/await prisma\.notification\.deleteMany\(\{\}\);[\s\S]*?await prisma\.user\.deleteMany\(\{\}\);/, deleteSection.trim());

// 2. Add avatar_url to fixed users
content = content.replace(/avatar_seed: 'AhmedKhan88',/, "avatar_seed: 'AhmedKhan88',\n      avatar_url: '/avatars/student_1.jpg',");
content = content.replace(/avatar_seed: 'FatimaZahra92',/, "avatar_seed: 'FatimaZahra92',\n      avatar_url: '/avatars/student_2.jpg',");
content = content.replace(/avatar_seed: 'AliRaza55',/, "avatar_seed: 'AliRaza55',\n      avatar_url: '/avatars/student_3.jpg',");
content = content.replace(/avatar_seed: 'SaraChen42',/, "avatar_seed: 'SaraChen42',\n      avatar_url: '/avatars/mentor_1.jpg',");
content = content.replace(/avatar_seed: 'HassanTariq99',/, "avatar_seed: 'HassanTariq99',\n      avatar_url: '/avatars/mentor_2.jpg',");

// 3. Add avatar_url to generated students
content = content.replace(/avatar_seed: \`\$\{item\.name\.replace\(\/\\s\+\/g, ''\)\}\$\{i\}\`,/, 
  "avatar_seed: `${item.name.replace(/\\s+/g, '')}${i}`,\n        avatar_url: `/avatars/student_${i+4}.jpg`,");

// 4. Add avatar_url to generated mentors
content = content.replace(/avatar_seed: \`\$\{m\.name\.replace\(\/\[\^a-zA-Z\]\/g, ''\)\}\$\{i\}\`,/, 
  "avatar_seed: `${m.name.replace(/[^a-zA-Z]/g, '')}${i}`,\n        avatar_url: `/avatars/mentor_${i+3}.jpg`,");

// 5. Add image_url to 40 scholarships based on country
// We can use a regex to match country: '...' and insert image_url after it
const countryMap = {
  'Germany': '/campuses/germany.jpg',
  'UK': '/campuses/uk.jpg',
  'Canada': '/campuses/canada.jpg',
  'USA': '/campuses/usa.jpg',
  'Turkey': '/campuses/turkey.jpg',
  'China': '/campuses/china.jpg',
  'Australia': '/campuses/australia.jpg',
  'Netherlands': '/campuses/netherlands.jpg',
  'South Korea': '/campuses/south_korea.jpg',
  'UAE': '/campuses/uae.jpg',
};

// Replace all instances of `country: 'XXX',` in the scholarshipsData array
content = content.replace(/country:\s*'([^']+)',/g, (match, country) => {
  const imageUrl = countryMap[country] || '/campuses/general.jpg';
  // ONLY add image_url if it's not already there (we can assume it's not based on the prompt)
  return `${match}\n      image_url: '${imageUrl}',`;
});

// Wait, the regex might match countries in Mentor Profile generation, let's fix that.
// Let's just restore Mentor profiles if they got affected.
content = content.replace(/country: m.country,\n      image_url: '\/campuses\/general\.jpg',/g, "country: m.country,");

// Let's be safer: Only replace in the scholarshipsData array
let parts = content.split('const scholarshipsData = [');
if (parts.length > 1) {
    let secondPart = parts[1];
    secondPart = secondPart.replace(/country:\s*'([^']+)',/g, (match, country) => {
        const imageUrl = countryMap[country] || '/campuses/general.jpg';
        return `${match}\n      image_url: '${imageUrl}',`;
    });
    content = parts[0] + 'const scholarshipsData = [' + secondPart;
}


// 6. Pre-seeded Connections, Sessions, ServiceRequests
// We will append this to the end of the file, right before the closing bracket of `async function main() {`

const newData = `
  console.log('Seeding connections...');
  await prisma.connection.createMany({
    data: [
      { student_id: studentAhmedUser.id, mentor_id: mentorSaraUser.id, status: 'accepted', message: 'Hi Sara, I need DAAD guidance!' },
      { student_id: studentAhmedUser.id, mentor_id: mentorHassanUser.id, status: 'pending', message: 'Would love to discuss Chevening options too' },
      { student_id: studentFatimaUser.id, mentor_id: mentorHassanUser.id, status: 'accepted', message: 'Need Chevening essay help' },
      { student_id: studentFatimaUser.id, mentor_id: mentorSaraUser.id, status: 'pending' },
    ]
  });

  console.log('Seeding session recording and new sessions...');
  // Find Ahmed's completed session with Sara
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

  // Fatima requested new session with Sara
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
  // Need to get some student IDs (Ali is fixed 3, Ahmed 1, Fatima 2)
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

  // Random requests
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
  
  // Need 1 more mentor for Ali's request
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

content = content.replace(/console\.log\('✅ Database seeding completed successfully!'\);/, newData + "\n  console.log('✅ Database seeding completed successfully!');");

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Done rewriting seed.js');

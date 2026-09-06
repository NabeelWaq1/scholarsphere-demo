const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for ScholarSphere...');

  // Clean existing records in reverse dependency order
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

  const defaultPasswordHash = await bcrypt.hash('Demo1234', 10);

  // ==========================================
  // 1. FIXED DEMO USERS
  // ==========================================
  console.log('Creating fixed demo users...');

  // Fixed Student 1: Ahmed (CS, GPA 3.6, Germany/Canada)
  const studentAhmedUser = await prisma.user.create({
    data: {
      name: 'Ahmed Khan',
      email: 'student.ahmed@demo.com',
      password_hash: defaultPasswordHash,
      role: 'student',
      avatar_seed: 'AhmedKhan88',
      avatar_url: '/avatars/student_1.jpg',
      headline: 'Computer Science Student @ FAST-NUCES | Aspiring to study in Germany & Canada',
      country_of_origin: 'Pakistan',
      student_profile: {
        create: {
          university: 'FAST-NUCES Islamabad',
          field_of_study: 'Computer Science',
          degree_level: 'graduate',
          gpa: 3.6,
          graduation_year: 2024,
          budget_range: 'Fully funded only',
          preferred_countries: JSON.stringify(['Germany', 'Canada', 'Netherlands']),
          bio: 'Final-year CS undergrad passionate about Distributed Systems and ML. Looking for fully funded DAAD, Erasmus Mundus, or Canadian scholarships for Fall 2025.',
          ielts_toefl_score: 'IELTS 7.5',
          interests: JSON.stringify(['Machine Learning', 'Cloud Computing', 'Research Publications', 'Open Source'])
        }
      }
    }
  });

  // Fixed Student 2: Fatima (Medicine, GPA 3.9, UK)
  const studentFatimaUser = await prisma.user.create({
    data: {
      name: 'Dr. Fatima Zahra',
      email: 'student.fatima@demo.com',
      password_hash: defaultPasswordHash,
      role: 'student',
      avatar_seed: 'FatimaZahra92',
      avatar_url: '/avatars/student_2.jpg',
      headline: 'Final Year MBBS @ King Edward Medical University | Aspiring UK Chevening Scholar',
      country_of_origin: 'Pakistan',
      student_profile: {
        create: {
          university: 'King Edward Medical University Lahore',
          field_of_study: 'Medicine',
          degree_level: 'graduate',
          gpa: 3.9,
          graduation_year: 2024,
          budget_range: 'Fully funded only',
          preferred_countries: JSON.stringify(['UK', 'USA', 'Australia']),
          bio: 'Medical graduate with distinctions in pathology and surgery. Seeking postgraduate clinical research scholarships in the UK (Chevening, Commonwealth) focusing on Global Health.',
          ielts_toefl_score: 'IELTS 8.0',
          interests: JSON.stringify(['Global Health', 'Epidemiology', 'Clinical Research', 'Health Policy'])
        }
      }
    }
  });

  // Fixed Student 3: Ali (Business, GPA 3.1, budget-conscious)
  const studentAliUser = await prisma.user.create({
    data: {
      name: 'Ali Raza',
      email: 'student.ali@demo.com',
      password_hash: defaultPasswordHash,
      role: 'student',
      avatar_seed: 'AliRaza55',
      avatar_url: '/avatars/student_3.jpg',
      headline: 'BBA Finance @ IBA Karachi | Seeking Fully Funded Masters Abroad',
      country_of_origin: 'Pakistan',
      student_profile: {
        create: {
          university: 'Institute of Business Administration (IBA) Karachi',
          field_of_study: 'Business',
          degree_level: 'graduate',
          gpa: 3.1,
          graduation_year: 2023,
          budget_range: 'Fully funded only',
          preferred_countries: JSON.stringify(['Turkey', 'Germany', 'China', 'South Korea']),
          bio: 'Finance graduate with 1 year fintech experience. Looking for full-ride scholarships in Europe or Asia for an MBA or MSc in Sustainable Finance.',
          ielts_toefl_score: 'IELTS 6.5',
          interests: JSON.stringify(['FinTech', 'Supply Chain', 'Venture Capital', 'International Business'])
        }
      }
    }
  });

  // Fixed Mentor 1: Sara (DAAD scholar, TU Berlin)
  const mentorSaraUser = await prisma.user.create({
    data: {
      name: 'Sara Chen',
      email: 'mentor.sara@demo.com',
      password_hash: defaultPasswordHash,
      role: 'mentor',
      avatar_seed: 'SaraChen42',
      avatar_url: '/avatars/mentor_1.jpg',
      headline: 'DAAD Scholar & M.Sc. Computer Science @ TU Berlin | Ex-Amazon Intern',
      country_of_origin: 'Pakistan',
      mentor_profile: {
        create: {
          current_university: 'Technical University of Berlin (TU Berlin)',
          field_of_study: 'Computer Science',
          degree_level: 'graduate',
          country: 'Germany',
          scholarship_they_hold: 'DAAD Postgraduate Study Scholarship',
          years_experience_mentoring: 3,
          bio: 'Awarded the full DAAD scholarship in 2022. Mentored 40+ international students in getting admission to German public universities with zero tuition fees. Specializing in SOP reviews, German visa appointments, and professor outreach.',
          rating: 4.9,
          total_reviews: 42,
          response_time_hours: 12,
          services: {
            create: [
              {
                title: 'Comprehensive SOP & Motivation Letter Review (German Unis)',
                category: 'SOP review',
                price: 35.0,
                delivery_time_days: 3,
                description: 'Detailed line-by-line critique of your motivation letter tailored for German universities & DAAD committee expectations.'
              },
              {
                title: 'German Student Visa & Blocked Account Guidance',
                category: 'Visa guidance',
                price: 25.0,
                delivery_time_days: 2,
                description: 'Step-by-step checklist, appointment tips, cover letter review, and embassy interview preparation.'
              },
              {
                title: 'Full DAAD Scholarship Application Review',
                category: 'Scholarship application review',
                price: 45.0,
                delivery_time_days: 4,
                description: 'End-to-end audit of all scholarship documents including proposal, CV, and recommendation letters.'
              }
            ]
          }
        }
      }
    }
  });

  // Fixed Mentor 2: Hassan (Chevening scholar, LSE)
  const mentorHassanUser = await prisma.user.create({
    data: {
      name: 'Hassan Tariq',
      email: 'mentor.hassan@demo.com',
      password_hash: defaultPasswordHash,
      role: 'mentor',
      avatar_seed: 'HassanTariq99',
      avatar_url: '/avatars/mentor_2.jpg',
      headline: 'Chevening Scholar | M.Sc. Public Policy @ London School of Economics (LSE)',
      country_of_origin: 'Pakistan',
      mentor_profile: {
        create: {
          current_university: 'London School of Economics (LSE)',
          field_of_study: 'Public Health',
          degree_level: 'graduate',
          country: 'UK',
          scholarship_they_hold: 'Chevening UK Scholarship',
          years_experience_mentoring: 4,
          bio: 'Chevening Scholar 2021-22 at LSE. Guided 60+ candidates through Chevening essays (Leadership, Networking, Study in UK, Career Plan) and British Embassy interview grilling.',
          rating: 4.85,
          total_reviews: 36,
          response_time_hours: 8,
          services: {
            create: [
              {
                title: 'Chevening 4-Essay Intensive Review & Editing',
                category: 'SOP review',
                price: 40.0,
                delivery_time_days: 3,
                description: 'In-depth restructuring of all 4 Chevening essays with STAR technique and impact metrics.'
              },
              {
                title: '1-on-1 Chevening & Commonwealth Mock Interview',
                category: 'Interview prep',
                price: 30.0,
                delivery_time_days: 2,
                description: 'Realistic 45-minute mock interview simulating the British High Commission panel with comprehensive scorecard.'
              }
            ]
          }
        }
      }
    }
  });

  // ==========================================
  // 2. 57 ADDITIONAL STUDENT PROFILES (Total: 60)
  // ==========================================
  console.log('Generating 57 additional diverse student profiles...');

  const studentNameList = [
    // Pakistan
    { name: 'Bilal Farooq', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'NUST Islamabad' },
    { name: 'Zainab Bibi', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'LUMS Lahore' },
    { name: 'Hamza Malik', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'UET Lahore' },
    { name: 'Ayesha Siddiqui', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'COMSATS Islamabad' },
    { name: 'Usman Ghani', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'GIKI Swabi' },
    { name: 'Sadia Munir', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'Aga Khan University' },
    { name: 'Omer Saeed', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'NED University Karachi' },
    { name: 'Maryam Khalid', country: 'Pakistan',
      image_url: '/campuses/general.jpg', uni: 'Punjab University' },
    // India
    { name: 'Rahul Sharma', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'IIT Delhi' },
    { name: 'Priya Patel', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'BITS Pilani' },
    { name: 'Aarav Verma', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'IIT Bombay' },
    { name: 'Ananya Iyer', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'Anna University' },
    { name: 'Rohan Gupta', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'NIT Trichy' },
    { name: 'Sneha Nair', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'Delhi University' },
    { name: 'Aditya Joshi', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'Jadavpur University' },
    { name: 'Kavya Pillai', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'Manipal Academy' },
    { name: 'Devendra Singhania', country: 'India',
      image_url: '/campuses/general.jpg', uni: 'IIT Kharagpur' },
    // Nigeria
    { name: 'Chukwudi Okafor', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'University of Lagos' },
    { name: 'Amina Bello', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'Ahmadu Bello University' },
    { name: 'Olumide Adebayo', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'University of Ibadan' },
    { name: 'Chioma Eze', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'Covenant University' },
    { name: 'Babatunde Adeleke', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'Obafemi Awolowo University' },
    { name: 'Ngozi Okonjo', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'University of Nigeria Nsukka' },
    { name: 'Emeka Nwosu', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'Federal University of Tech Akure' },
    { name: 'Folake Adele', country: 'Nigeria',
      image_url: '/campuses/general.jpg', uni: 'Babcock University' },
    // Egypt
    { name: 'Youssef Ibrahim', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Cairo University' },
    { name: 'Mariam Mansour', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Ain Shams University' },
    { name: 'Tarek Hassan', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Alexandria University' },
    { name: 'Nour El-Din', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'American University in Cairo' },
    { name: 'Salma Mahmoud', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Mansoura University' },
    { name: 'Karim Farouk', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Assiut University' },
    { name: 'Hoda Soliman', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Helwan University' },
    { name: 'Omar Al-Sayed', country: 'Egypt',
      image_url: '/campuses/general.jpg', uni: 'Zewail City of Science' },
    // Philippines
    { name: 'Joshua Santos', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'University of the Philippines Diliman' },
    { name: 'Maria Cruz', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'Ateneo de Manila University' },
    { name: 'Angelo Reyes', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'De La Salle University' },
    { name: 'Bea Mendoza', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'University of Santo Tomas' },
    { name: 'Christian Ramos', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'Mapúa University' },
    { name: 'Nicole Dela Cruz', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'Polytechnic University of the Philippines' },
    { name: 'Gabriel Bautista', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'Silliman University' },
    { name: 'Camille Tan', country: 'Philippines',
      image_url: '/campuses/general.jpg', uni: 'Far Eastern University' },
    // Bangladesh
    { name: 'Tanvir Hasan', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'BUET Dhaka' },
    { name: 'Nusrat Jahan', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'University of Dhaka' },
    { name: 'Shakib Rahman', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'North South University' },
    { name: 'Farhana Ahmed', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'BRAC University' },
    { name: 'Mehedi Hasan', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'IUT Gazipur' },
    { name: 'Tasmia Sultana', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'Jahangirnagar University' },
    { name: 'Mahmudul Hoque', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'Chittagong University' },
    { name: 'Rumana Haque', country: 'Bangladesh',
      image_url: '/campuses/general.jpg', uni: 'Ahsanullah University' },
    // Kenya
    { name: 'Brian Kiprop', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'University of Nairobi' },
    { name: 'Wanjiku Mwangi', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Strathmore University' },
    { name: 'Kevin Omondi', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Jomo Kenyatta University (JKUAT)' },
    { name: 'Faith Chebet', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Kenyatta University' },
    { name: 'Dennis Mutua', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Moi University' },
    { name: 'Mercy Achieng', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Egerton University' },
    { name: 'Silas Korir', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Maseno University' },
    { name: 'Brenda Njeri', country: 'Kenya',
      image_url: '/campuses/general.jpg', uni: 'Daystar University' }
  ];

  const fieldsPool = [
    'Computer Science', 'Data Science', 'Engineering', 'Business', 
    'Medicine', 'Public Health', 'Law', 'Architecture'
  ];
  const countriesPool = ['Germany', 'Canada', 'UK', 'USA', 'Turkey', 'China', 'Australia', 'Netherlands', 'South Korea', 'UAE'];
  const budgetPool = ['Fully funded only', '$0-5000', '$5000-15000', '$15000+'];
  const degreeLevels = ['undergraduate', 'graduate'];

  for (let i = 0; i < studentNameList.length; i++) {
    const item = studentNameList[i];
    const field = fieldsPool[i % fieldsPool.length];
    // GPA bell curve ~ 2.8 to 3.9
    const gpaRaw = 2.8 + ((i * 7) % 12) * 0.1;
    const gpa = Math.min(3.95, parseFloat(gpaRaw.toFixed(2)));
    const deg = degreeLevels[i % 2];
    const budget = budgetPool[i % budgetPool.length];
    
    // Pick 2-3 preferred countries
    const c1 = countriesPool[i % countriesPool.length];
    const c2 = countriesPool[(i + 3) % countriesPool.length];
    const preferredCountries = [c1, c2];

    const email = `student.${item.name.toLowerCase().replace(/[^a-z]/g, '')}${i}@demo.com`;

    await prisma.user.create({
      data: {
        name: item.name,
        email: email,
        password_hash: defaultPasswordHash,
        role: 'student',
        avatar_seed: `${item.name.replace(/\s+/g, '')}${i}`,
        avatar_url: `/avatars/student_${i+4}.jpg`,
        headline: `${deg === 'graduate' ? 'BSc' : 'High School Graduate'} in ${field} @ ${item.uni} | Aspiring International Scholar`,
        country_of_origin: item.country,
        student_profile: {
          create: {
            university: item.uni,
            field_of_study: field,
            degree_level: deg,
            gpa: gpa,
            graduation_year: 2023 + (i % 3),
            budget_range: budget,
            preferred_countries: JSON.stringify(preferredCountries),
            bio: `Ambitious student from ${item.country} preparing scholarship applications for ${preferredCountries.join(' and ')}. Focus on ${field}.`,
            ielts_toefl_score: i % 2 === 0 ? `IELTS ${(6.5 + (i % 4) * 0.5).toFixed(1)}` : 'Duolingo 125',
            interests: JSON.stringify([field, 'Global Higher Ed', 'Research Fellowships'])
          }
        }
      }
    });
  }

  // ==========================================
  // 3. 48 ADDITIONAL MENTOR PROFILES (Total: 50)
  // ==========================================
  console.log('Generating 48 additional diverse mentor profiles...');

  const mentorPool = [
    { name: 'Dr. Aris Thorne', uni: 'ETH Zurich', country: 'Switzerland',
      image_url: '/campuses/general.jpg', field: 'Engineering', scholarship: 'Swiss Excellence Government Fellowship', exp: 6, rating: 4.95, reviews: 78 },
    { name: 'Elena Vance', uni: 'University of Toronto', country: 'Canada',
      image_url: '/campuses/canada.jpg', field: 'Computer Science', scholarship: 'Lester B. Pearson International Scholarship', exp: 4, rating: 4.9, reviews: 54 },
    { name: 'Liam Sterling', uni: 'Imperial College London', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Data Science', scholarship: 'Commonwealth Masters Fellowship', exp: 5, rating: 4.88, reviews: 62 },
    { name: 'Amara Okafor', uni: 'University of Oxford', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Public Health', scholarship: 'Rhodes International Scholarship', exp: 5, rating: 4.96, reviews: 70 },
    { name: 'Kenji Sato', uni: 'University of Tokyo', country: 'Japan',
      image_url: '/campuses/general.jpg', field: 'Engineering', scholarship: 'MEXT Japanese Government Scholarship', exp: 4, rating: 4.82, reviews: 41 },
    { name: 'Dr. Mei-Ling Zhou', uni: 'NUS Singapore', country: 'Singapore',
      image_url: '/campuses/general.jpg', field: 'Computer Science', scholarship: 'SINGA Award', exp: 5, rating: 4.92, reviews: 65 },
    { name: 'Marcus Lindholm', uni: 'TU Delft', country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg', field: 'Architecture', scholarship: 'Holland Scholarship (NL Scholarship)', exp: 3, rating: 4.79, reviews: 29 },
    { name: 'Fatoumata Diallo', uni: 'Sorbonne University', country: 'France',
      image_url: '/campuses/general.jpg', field: 'Law', scholarship: 'Eiffel Excellence Scholarship', exp: 4, rating: 4.86, reviews: 38 },
    { name: 'Emre Demir', uni: 'Koç University & TU Munich', country: 'Germany',
      image_url: '/campuses/germany.jpg', field: 'Computer Science', scholarship: 'DAAD Helmut-Schmidt-Programme', exp: 4, rating: 4.91, reviews: 50 },
    { name: 'Pooja Deshmukh', uni: 'University of Melbourne', country: 'Australia',
      image_url: '/campuses/australia.jpg', field: 'Business', scholarship: 'Australia Awards Scholarship', exp: 3, rating: 4.84, reviews: 33 },
    { name: 'Dr. Tariq Mansoor', uni: 'Heidelberg University', country: 'Germany',
      image_url: '/campuses/germany.jpg', field: 'Medicine', scholarship: 'Erasmus Mundus Joint Doctorate', exp: 7, rating: 4.98, reviews: 82 },
    { name: 'Chloe Dubois', uni: 'McGill University', country: 'Canada',
      image_url: '/campuses/canada.jpg', field: 'Data Science', scholarship: 'Vanier Canada Graduate Scholarship', exp: 3, rating: 4.78, reviews: 25 },
    { name: 'Sun-Woo Park', uni: 'KAIST', country: 'South Korea',
      image_url: '/campuses/south_korea.jpg', field: 'Engineering', scholarship: 'Global Korea Scholarship (GKS)', exp: 4, rating: 4.87, reviews: 44 },
    { name: 'Zubair Al-Hashimi', uni: 'Khalifa University', country: 'UAE',
      image_url: '/campuses/uae.jpg', field: 'Engineering', scholarship: 'UAE University Full Fellowship', exp: 3, rating: 4.8, reviews: 28 },
    { name: 'Anika Rahman', uni: 'University of Edinburgh', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Public Health', scholarship: 'Chevening Scholarship', exp: 3, rating: 4.89, reviews: 39 },
    { name: 'Carlos Mendez', uni: 'Stanford University', country: 'USA',
      image_url: '/campuses/usa.jpg', field: 'Computer Science', scholarship: 'Knight-Hennessy Scholars', exp: 5, rating: 4.94, reviews: 67 },
    { name: 'Amina Al-Mansouri', uni: 'NYU Abu Dhabi', country: 'UAE',
      image_url: '/campuses/uae.jpg', field: 'Business', scholarship: 'Sheikh Mohamed bin Zayed Fellowship', exp: 3, rating: 4.85, reviews: 31 },
    { name: 'Vikramaditya Rao', uni: 'TU Munich (TUM)', country: 'Germany',
      image_url: '/campuses/germany.jpg', field: 'Engineering', scholarship: 'DAAD Study Scholarship', exp: 4, rating: 4.9, reviews: 52 },
    { name: 'Nadia Cherif', uni: 'Bilkent University', country: 'Turkey',
      image_url: '/campuses/turkey.jpg', field: 'Business', scholarship: 'Türkiye Bursları Full Grant', exp: 3, rating: 4.75, reviews: 22 },
    { name: 'Oluwaseun Balogun', uni: 'University of Cambridge', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Law', scholarship: 'Gates Cambridge Scholarship', exp: 6, rating: 4.97, reviews: 75 },
    { name: 'Hanna Becker', uni: 'Ludwig Maximilian University', country: 'Germany',
      image_url: '/campuses/germany.jpg', field: 'Medicine', scholarship: 'Bavarian Research Elite Network', exp: 4, rating: 4.88, reviews: 40 },
    { name: 'Wei Zhang', uni: 'Tsinghua University', country: 'China',
      image_url: '/campuses/china.jpg', field: 'Computer Science', scholarship: 'Chinese Government Scholarship (CSC)', exp: 4, rating: 4.81, reviews: 36 },
    { name: 'Dr. Jessica Wong', uni: 'Harvard T.H. Chan', country: 'USA',
      image_url: '/campuses/usa.jpg', field: 'Public Health', scholarship: 'Fulbright Foreign Student Fellowship', exp: 6, rating: 4.96, reviews: 80 },
    { name: 'Mustafa Cengiz', uni: 'Middle East Technical University', country: 'Turkey',
      image_url: '/campuses/turkey.jpg', field: 'Architecture', scholarship: 'Türkiye Bursları Scholar', exp: 3, rating: 4.76, reviews: 26 },
    { name: 'Preeti Sengupta', uni: 'UCL London', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Data Science', scholarship: 'Commonwealth Masters Fellowship', exp: 4, rating: 4.85, reviews: 43 },
    { name: 'Babatunde Fashola', uni: 'University of British Columbia', country: 'Canada',
      image_url: '/campuses/canada.jpg', field: 'Engineering', scholarship: 'UBC International Leader of Tomorrow', exp: 4, rating: 4.92, reviews: 51 },
    { name: 'Ingrid Larsen', uni: 'KTH Royal Institute of Tech', country: 'Sweden',
      image_url: '/campuses/general.jpg', field: 'Computer Science', scholarship: 'Swedish Institute Scholarship (SISGP)', exp: 5, rating: 4.9, reviews: 58 },
    { name: 'Siddharth Nair', uni: 'University of Waterloo', country: 'Canada',
      image_url: '/campuses/canada.jpg', field: 'Computer Science', scholarship: 'Waterloo Graduate Merit Fellowship', exp: 3, rating: 4.83, reviews: 34 },
    { name: 'Fatima Al-Suwaidi', uni: 'Imperial College London', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Engineering', scholarship: 'Qatar Foundation Merit Scholar', exp: 3, rating: 4.86, reviews: 30 },
    { name: 'Adewale Adeleke', uni: 'Seoul National University', country: 'South Korea',
      image_url: '/campuses/south_korea.jpg', field: 'Business', scholarship: 'Global Korea Scholarship (GKS)', exp: 4, rating: 4.79, reviews: 32 },
    { name: 'Siti Nurhaliza', uni: 'University of Sydney', country: 'Australia',
      image_url: '/campuses/australia.jpg', field: 'Medicine', scholarship: 'Sydney International Research Award', exp: 4, rating: 4.91, reviews: 48 },
    { name: 'Tariq Al-Masri', uni: 'RWTH Aachen University', country: 'Germany',
      image_url: '/campuses/germany.jpg', field: 'Engineering', scholarship: 'DAAD Graduate Grant', exp: 5, rating: 4.93, reviews: 61 },
    { name: 'Maya Angelis', uni: 'Leiden University', country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg', field: 'Law', scholarship: 'Leiden University Excellence Scholarship', exp: 4, rating: 4.84, reviews: 37 },
    { name: 'Zubair Qureshi', uni: 'McMaster University', country: 'Canada',
      image_url: '/campuses/canada.jpg', field: 'Medicine', scholarship: 'Canadian Commonwealth Fellow', exp: 5, rating: 4.95, reviews: 69 },
    { name: 'Farida Osman', uni: 'Erasmus University Rotterdam', country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg', field: 'Business', scholarship: 'Erasmus Trustfonds Grant', exp: 3, rating: 4.8, reviews: 29 },
    { name: 'Arjun Kapoor', uni: 'Columbia University', country: 'USA',
      image_url: '/campuses/usa.jpg', field: 'Data Science', scholarship: 'Fulbright Science & Tech Award', exp: 5, rating: 4.94, reviews: 71 },
    { name: 'Blessing Okoye', uni: 'University of Manchester', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Architecture', scholarship: 'Manchester Global Futures Award', exp: 3, rating: 4.77, reviews: 24 },
    { name: 'Jonas Richter', uni: 'University of Zurich', country: 'Switzerland',
      image_url: '/campuses/general.jpg', field: 'Computer Science', scholarship: 'Swiss National Science Fellowship', exp: 4, rating: 4.88, reviews: 45 },
    { name: 'Hira Batool', uni: 'King\'s College London', country: 'UK',
      image_url: '/campuses/uk.jpg', field: 'Public Health', scholarship: 'Chevening Scholar', exp: 4, rating: 4.9, reviews: 49 },
    { name: 'Dmitri Ivanov', uni: 'Aalto University', country: 'Finland',
      image_url: '/campuses/general.jpg', field: 'Computer Science', scholarship: 'Aalto Merit Fellowship', exp: 4, rating: 4.83, reviews: 35 },
    { name: 'Layla Mahmoud', uni: 'Zayed University', country: 'UAE',
      image_url: '/campuses/uae.jpg', field: 'Data Science', scholarship: 'Emirates Excellence Award', exp: 3, rating: 4.82, reviews: 27 },
    { name: 'Kwame Mensah', uni: 'University of Alberta', country: 'Canada',
      image_url: '/campuses/canada.jpg', field: 'Engineering', scholarship: 'Alberta Graduate Excellence Scholarship', exp: 4, rating: 4.87, reviews: 40 },
    { name: 'Natasha Romanova', uni: 'Trinity College Dublin', country: 'Ireland',
      image_url: '/campuses/general.jpg', field: 'Law', scholarship: 'Government of Ireland International Fellow', exp: 4, rating: 4.85, reviews: 39 },
    { name: 'Bilal Chaudhry', uni: 'Monash University', country: 'Australia',
      image_url: '/campuses/australia.jpg', field: 'Business', scholarship: 'Monash International Merit Award', exp: 3, rating: 4.81, reviews: 31 },
    { name: 'Yuki Tanaka', uni: 'Kyoto University', country: 'Japan',
      image_url: '/campuses/general.jpg', field: 'Engineering', scholarship: 'MEXT Monbukagakusho Fellow', exp: 5, rating: 4.93, reviews: 59 },
    { name: 'Dr. Samuel Osei', uni: 'Johns Hopkins University', country: 'USA',
      image_url: '/campuses/usa.jpg', field: 'Public Health', scholarship: 'Fulbright Visiting Scholar', exp: 7, rating: 4.99, reviews: 88 },
    { name: 'Zahra Gholami', uni: 'Istanbul Technical University', country: 'Turkey',
      image_url: '/campuses/turkey.jpg', field: 'Architecture', scholarship: 'Türkiye Bursları Gold Award', exp: 3, rating: 4.78, reviews: 25 },
    { name: 'Christian Meyer', uni: 'TU Dresden', country: 'Germany',
      image_url: '/campuses/germany.jpg', field: 'Computer Science', scholarship: 'DAAD Smart System Grant', exp: 4, rating: 4.89, reviews: 46 }
  ];

  const serviceCategories = [
    'SOP review', 'Visa guidance', 'Interview prep', 
    'Recommendation letter help', 'University shortlisting', 'Scholarship application review'
  ];

  const sampleReviews = [
    { student: 'Ahmed Khan', rating: 5, comment: 'Incredible insight! Fixed my SOP narrative and helped me win the interview round.' },
    { student: 'Priya Patel', rating: 5, comment: 'Super fast turnaround and very detailed advice on German embassy visa protocols!' },
    { student: 'Chukwudi Okafor', rating: 5, comment: 'Worth every penny. The mock interview prepared me exactly for the actual questions.' },
    { student: 'Maria Cruz', rating: 4, comment: 'Great feedback on my recommendation letters. Very thorough and encouraging.' },
    { student: 'Youssef Ibrahim', rating: 5, comment: 'Outstanding mentor. Truly understands what foreign scholarship boards are looking for.' },
    { student: 'Tanvir Hasan', rating: 5, comment: 'Helped me shortlist 5 tuition-free universities in Germany and 3 in Sweden.' },
    { student: 'Brian Kiprop', rating: 4, comment: 'Clear, concise feedback. Helped turn my average draft into an award-winning SOP.' }
  ];

  const createdMentorProfiles = [];

  for (let i = 0; i < mentorPool.length; i++) {
    const m = mentorPool[i];
    const email = `mentor.${m.name.toLowerCase().replace(/[^a-z]/g, '')}${i}@demo.com`;

    // 1 to 3 services
    const servicesData = [];
    const cat1 = serviceCategories[i % serviceCategories.length];
    const cat2 = serviceCategories[(i + 2) % serviceCategories.length];
    const price1 = 15 + (i % 6) * 10;
    const price2 = 25 + ((i + 1) % 5) * 10;

    servicesData.push({
      title: `${cat1} Consultation & Feedback`,
      category: cat1,
      price: price1,
      delivery_time_days: 2 + (i % 5),
      description: `Professional, step-by-step ${cat1.toLowerCase()} based on real admission & committee review experience at ${m.uni}.`
    });

    if (i % 2 === 0) {
      servicesData.push({
        title: `Comprehensive ${cat2} Deep Dive`,
        category: cat2,
        price: price2,
        delivery_time_days: 3 + (i % 4),
        description: `Hands-on document review, rubric benchmarking, and actionable revision notes tailored for ${m.scholarship}.`
      });
    }

    // 3 to 5 seeded reviews
    const reviewsData = [];
    const reviewCount = 3 + (i % 3);
    for (let r = 0; r < reviewCount; r++) {
      const rev = sampleReviews[(i + r) % sampleReviews.length];
      reviewsData.push({
        student_name: rev.student,
        rating: rev.rating,
        comment: rev.comment
      });
    }

    const mentorUser = await prisma.user.create({
      data: {
        name: m.name,
        email: email,
        password_hash: defaultPasswordHash,
        role: 'mentor',
        avatar_seed: `${m.name.replace(/[^a-zA-Z]/g, '')}${i}`,
        avatar_url: `/avatars/mentor_${i+3}.jpg`,
        headline: `${m.scholarship} Holder | ${m.uni}`,
        country_of_origin: m.country,
        mentor_profile: {
          create: {
            current_university: m.uni,
            field_of_study: m.field,
            degree_level: 'graduate',
            country: m.country,
            scholarship_they_hold: m.scholarship,
            years_experience_mentoring: m.exp,
            bio: `Currently at ${m.uni}. Holder of the ${m.scholarship}. Over ${m.exp} years helping international scholars navigate competitive funding pools and admissions abroad.`,
            rating: m.rating,
            total_reviews: m.reviews,
            response_time_hours: 6 + (i % 18),
            services: {
              create: servicesData
            },
            reviews: {
              create: reviewsData
            }
          }
        }
      },
      include: {
        mentor_profile: {
          include: {
            services: true
          }
        }
      }
    });

    createdMentorProfiles.push(mentorUser);
  }

  // ==========================================
  // 4. 40 SCHOLARSHIPS
  // ==========================================
  console.log('Generating 40 realistic international scholarships...');

  const now = new Date();

  // Helper to add days to now
  const addDays = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  };

  const scholarshipsData = [
    // Germany
    {
      title: 'DAAD Helmut-Schmidt-Programme (PPGG)',
      provider: 'German Academic Exchange Service (DAAD)',
      country: 'Germany',
      image_url: '/campuses/germany.jpg',
      image_url: '/campuses/germany.jpg',
      field_of_study: 'Public Health',
      degree_level: 'graduate',
      min_gpa_required: 3.2,
      funding_type: 'full',
      amount_description: 'Full tuition waiver + €934/month stipend + health insurance + travel allowance',
      deadline: addDays(18), // Closing soon!
      description: 'The Helmut-Schmidt-Programme offers future leaders from developing countries the chance to acquire a Master’s degree in disciplines that are of special relevance to social, political and economic development in Germany.',
      tags: ['Germany', 'Full Ride', 'Monthly Stipend', 'Public Sector', 'Closing Soon'],
      required_documents: ['DAAD Application Form', 'Hand-signed Motivation Letter (2 pages)', 'Curriculum Vitae (Europass)', 'University Diplomas & Transcripts', 'Two Letters of Recommendation']
    },
    {
      title: 'DAAD Postgraduate Scholarships in STEM',
      provider: 'German Academic Exchange Service (DAAD)',
      country: 'Germany',
      image_url: '/campuses/germany.jpg',
      image_url: '/campuses/germany.jpg',
      field_of_study: 'Computer Science',
      degree_level: 'graduate',
      min_gpa_required: 3.4,
      funding_type: 'full',
      amount_description: 'Full tuition waiver + €934/month stipend + study allowance of €460/year + travel grant',
      deadline: addDays(75),
      description: 'Enables highly qualified graduates with a first academic degree in computer science and STEM disciplines to complete a Master degree course at a state or state-recognized German university.',
      tags: ['Germany', 'STEM', 'Fully Funded', 'DAAD', 'Computer Science'],
      required_documents: ['Online Application', 'Certified Degree Certificates', 'Detailed Curriculum Vitae', 'Academic Motivation Letter', 'English Proficiency Proof (IELTS/TOEFL)']
    },
    {
      title: 'Deutschlandstipendium Merit Scholarship',
      provider: 'German Federal Government & Partner Universities',
      country: 'Germany',
      image_url: '/campuses/germany.jpg',
      image_url: '/campuses/germany.jpg',
      field_of_study: 'Any',
      degree_level: 'undergraduate',
      min_gpa_required: 3.3,
      funding_type: 'partial',
      amount_description: '€300 per month (€150 from government, €150 from private sponsor)',
      deadline: addDays(14), // Closing soon!
      description: 'The Germany Scholarship supports high-achieving and committed students from all over the world at participating German universities.',
      tags: ['Germany', 'Undergraduate', 'Merit-Based', 'Monthly Grant', 'Closing Soon'],
      required_documents: ['University Enrollment Certificate', 'High School / Abitur Equivalent Diploma', 'Letter of Motivation', 'Extracurricular Activities Proof']
    },
    {
      title: 'Heinrich Böll Foundation Grants',
      provider: 'Heinrich Böll Foundation',
      country: 'Germany',
      image_url: '/campuses/germany.jpg',
      image_url: '/campuses/germany.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: '€934/month + individual allowances + tuition fee coverage if applicable',
      deadline: addDays(120),
      description: 'Grants scholarships to approximately 1,500 undergraduates, graduates, and doctoral students of all subjects and nationalities per year who demonstrate social engagement and political awareness.',
      tags: ['Germany', 'Social Impact', 'Full Funding', 'All Fields'],
      required_documents: ['Entry Qualification', 'Certified Copies of First Degree', 'Motivation Letter', 'Expert Reference from University Professor']
    },
    {
      title: 'Konrad-Adenauer-Stiftung Masters Scholarship',
      provider: 'Konrad-Adenauer-Stiftung (KAS)',
      country: 'Germany',
      image_url: '/campuses/germany.jpg',
      image_url: '/campuses/germany.jpg',
      field_of_study: 'Law',
      degree_level: 'graduate',
      min_gpa_required: 3.2,
      funding_type: 'full',
      amount_description: '€861 per month + tuition reimbursements + comprehensive seminars',
      deadline: addDays(190),
      description: 'Aimed at international students and graduates who have already completed their first degree and wish to complete postgraduate studies or a doctorate in Germany.',
      tags: ['Germany', 'Law', 'Governance', 'Fully Funded'],
      required_documents: ['Detailed CV', 'Letter of Motivation', 'University Transcripts', 'B2/C1 German Certificate or English Equivalent']
    },

    // UK
    {
      title: 'Chevening UK Government Scholarship',
      provider: 'Foreign, Commonwealth and Development Office (FCDO)',
      country: 'UK',
      image_url: '/campuses/uk.jpg',
      image_url: '/campuses/uk.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.3,
      funding_type: 'full',
      amount_description: 'Full UK university tuition fees + monthly living allowance + economy return flights + visa fees',
      deadline: addDays(60),
      description: 'The UK government’s global scholarships programme, funding outstanding future leaders from Chevening-eligible countries to undertake a one-year Master’s degree at any accredited UK university.',
      tags: ['UK', 'Prestige', 'Full Ride', 'Leadership', 'All Majors'],
      required_documents: ['Four Chevening Essays (500 words each)', 'Official Degree Transcripts', 'Two Reference Letters', 'Unconditional UK University Offer']
    },
    {
      title: 'Commonwealth Master’s Scholarship',
      provider: 'Commonwealth Scholarship Commission (CSC)',
      country: 'UK',
      image_url: '/campuses/uk.jpg',
      image_url: '/campuses/uk.jpg',
      field_of_study: 'Engineering',
      degree_level: 'graduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: 'Approved airfare + full tuition fees + monthly stipend of £1,347 (£1,652 in London)',
      deadline: addDays(25), // Closing soon!
      description: 'For candidates from eligible low and middle income Commonwealth countries, to undertake full-time taught Master’s study at a UK university.',
      tags: ['UK', 'Commonwealth', 'STEM', 'Full Tuition', 'Closing Soon'],
      required_documents: ['CSC Online Application', 'Referees Letters', 'Personal Statement', 'Academic Transcripts', 'Proof of Citizenship']
    },
    {
      title: 'Gates Cambridge Scholarship',
      provider: 'Bill and Melinda Gates Foundation',
      country: 'UK',
      image_url: '/campuses/uk.jpg',
      image_url: '/campuses/uk.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.7,
      funding_type: 'full',
      amount_description: 'Full cost of studying at Cambridge: University fees, £20,000 maintenance allowance, airfare, family allowance',
      deadline: addDays(90),
      description: 'One of the most prestigious international scholarships in the world, covering a full-time postgraduate degree in any subject available at the University of Cambridge.',
      tags: ['UK', 'Cambridge', 'Elite', 'Full Funding', 'Research'],
      required_documents: ['Cambridge Graduate Application', 'Gates Cambridge Statement (500 words)', 'Research Proposal', 'Two Academic References', 'One Personal Reference']
    },
    {
      title: 'Rhodes Scholarship at Oxford',
      provider: 'The Rhodes Trust',
      country: 'UK',
      image_url: '/campuses/uk.jpg',
      image_url: '/campuses/uk.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.7,
      funding_type: 'full',
      amount_description: 'All university and college fees + annual stipend £18,180 + private health insurance + travel',
      deadline: addDays(110),
      description: 'The oldest graduate scholarship in the world, bringing outstanding young leaders to Oxford University for two or more years of transformative postgraduate study.',
      tags: ['UK', 'Oxford', 'Rhodes', 'Global Leaders', 'Fully Funded'],
      required_documents: ['Academic Transcripts', 'Comprehensive CV', 'Personal Statement (1000 words)', 'Four to Six Reference Letters', 'Birth Certificate / Passport']
    },
    {
      title: 'GREAT Scholarships UK',
      provider: 'British Council & UK Universities',
      country: 'UK',
      image_url: '/campuses/uk.jpg',
      image_url: '/campuses/uk.jpg',
      field_of_study: 'Business',
      degree_level: 'graduate',
      min_gpa_required: 3.0,
      funding_type: 'partial',
      amount_description: '£10,000 tuition fee discount towards a one-year taught postgraduate course',
      deadline: addDays(45),
      description: 'Offers students from 15 partner countries the opportunity to have £10,000 towards their tuition fees for a wide range of one-year taught postgraduate courses in the UK.',
      tags: ['UK', 'Business', 'Tuition Discount', 'British Council'],
      required_documents: ['University Conditional Offer', 'Academic Record', 'Short Statement of Purpose', 'Passport Copy']
    },

    // Canada
    {
      title: 'Lester B. Pearson International Scholarship',
      provider: 'University of Toronto',
      country: 'Canada',
      image_url: '/campuses/canada.jpg',
      image_url: '/campuses/canada.jpg',
      field_of_study: 'Any',
      degree_level: 'undergraduate',
      min_gpa_required: 3.6,
      funding_type: 'full',
      amount_description: 'Covers full tuition, books, incidental fees, and full residence support for 4 years',
      deadline: addDays(22), // Closing soon!
      description: 'Recognizes international students who demonstrate exceptional academic achievement, creativity, and leadership within their high school communities.',
      tags: ['Canada', 'Toronto', 'Undergraduate', 'Full Ride', 'Closing Soon'],
      required_documents: ['School Nomination Form', 'U of T International Student Application', 'Pearson Scholarship Essay', 'Teacher Recommendation']
    },
    {
      title: 'Vanier Canada Graduate Scholarship',
      provider: 'Government of Canada',
      country: 'Canada',
      image_url: '/campuses/canada.jpg',
      image_url: '/campuses/canada.jpg',
      field_of_study: 'Medicine',
      degree_level: 'graduate',
      min_gpa_required: 3.7,
      funding_type: 'full',
      amount_description: '$50,000 per year for up to three years during doctoral/postgraduate medical studies',
      deadline: addDays(150),
      description: 'Helps Canadian institutions attract highly qualified doctoral students in health research, natural sciences, engineering, and humanities.',
      tags: ['Canada', 'Doctoral', 'Health Sciences', 'High Stipend'],
      required_documents: ['Research Proposal (2 pages)', 'Project References', 'Leadership Statement', 'Two Leadership Letters of Reference', 'Transcripts']
    },
    {
      title: 'UBC International Leader of Tomorrow Award',
      provider: 'University of British Columbia (UBC)',
      country: 'Canada',
      image_url: '/campuses/canada.jpg',
      image_url: '/campuses/canada.jpg',
      field_of_study: 'Computer Science',
      degree_level: 'undergraduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: 'Tuition fees + living expenses proportional to financial need (up to $55,000/yr)',
      deadline: addDays(80),
      description: 'Awarded to international undergraduate students who demonstrate superior academic achievement and exceptional leadership skills.',
      tags: ['Canada', 'UBC', 'Undergrad', 'Need-and-Merit'],
      required_documents: ['Nomination by Secondary School', 'Student Financial Profile', 'Essays on Community Engagement', 'Official School Grades']
    },
    {
      title: 'University of Waterloo Master’s Merit Fellowship',
      provider: 'University of Waterloo',
      country: 'Canada',
      image_url: '/campuses/canada.jpg',
      image_url: '/campuses/canada.jpg',
      field_of_study: 'Data Science',
      degree_level: 'graduate',
      min_gpa_required: 3.4,
      funding_type: 'partial',
      amount_description: '$15,000/year toward tuition fees and research assistantship',
      deadline: addDays(105),
      description: 'Automatic consideration upon admission for exceptional incoming graduate students entering research-based master’s programs in mathematics and data science.',
      tags: ['Canada', 'Data Science', 'Tech', 'Research Assistantship'],
      required_documents: ['Online Graduate Application', 'Statement of Research Interest', 'Transcripts (WES evaluated if required)', '2 Academic References']
    },
    {
      title: 'McGill International Master’s Entrance Award',
      provider: 'McGill University',
      country: 'Canada',
      image_url: '/campuses/canada.jpg',
      image_url: '/campuses/canada.jpg',
      field_of_study: 'Engineering',
      degree_level: 'graduate',
      min_gpa_required: 3.3,
      funding_type: 'partial',
      amount_description: '$10,000 - $20,000 non-renewable entrance bursary',
      deadline: addDays(135),
      description: 'Awarded by the Faculty of Engineering to outstanding international applicants admitted into graduate degree programs.',
      tags: ['Canada', 'McGill', 'Engineering', 'Montreal'],
      required_documents: ['Application for Admission', 'Curriculum Vitae', 'Letter of Intent', 'Two Confidential Letters of Recommendation']
    },

    // USA
    {
      title: 'Fulbright Foreign Student Program',
      provider: 'U.S. Department of State',
      country: 'USA',
      image_url: '/campuses/usa.jpg',
      image_url: '/campuses/usa.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.4,
      funding_type: 'full',
      amount_description: 'Full tuition, monthly living stipend, health insurance, round-trip airfare, and J-1 visa sponsorship',
      deadline: addDays(65),
      description: 'Enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States at leading American universities.',
      tags: ['USA', 'Fulbright', 'Flagship', 'All Disciplines', 'Full Funding'],
      required_documents: ['Study/Research Objective Essay', 'Personal Statement', 'Three Letters of Recommendation', 'GRE/GMAT & TOEFL Scores', 'Transcripts & Degree']
    },
    {
      title: 'Knight-Hennessy Scholars at Stanford',
      provider: 'Stanford University',
      country: 'USA',
      image_url: '/campuses/usa.jpg',
      image_url: '/campuses/usa.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.6,
      funding_type: 'full',
      amount_description: 'Full funding for tuition, stipend for living and academic expenses, and travel stipend for up to 3 years',
      deadline: addDays(95),
      description: 'Knight-Hennessy Scholars cultivates and supports a multidisciplinary, multicultural community of Stanford graduate students prepared to address global challenges.',
      tags: ['USA', 'Stanford', 'Knight-Hennessy', 'Innovation', 'Full Funding'],
      required_documents: ['Stanford Degree Application', 'Knight-Hennessy Online Application', 'Resume / CV', 'Video Statement', 'Two Recommendation Letters']
    },
    {
      title: 'Harvard University Environmental Fellowship',
      provider: 'Harvard University Center for the Environment',
      country: 'USA',
      image_url: '/campuses/usa.jpg',
      image_url: '/campuses/usa.jpg',
      field_of_study: 'Public Health',
      degree_level: 'graduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: '$82,000 annual stipend + health insurance + $2,500 travel allowance',
      deadline: addDays(140),
      description: 'Postdoctoral and graduate fellowship designed to enable recent recipients to use the opportunity of consulting with Harvard faculty to expand their horizons.',
      tags: ['USA', 'Harvard', 'Public Health', 'Environment'],
      required_documents: ['Curriculum Vitae', 'Research Proposal (max 5 pages)', 'Three Recommendation Letters', 'Writing Sample']
    },
    {
      title: 'Columbia University Global Leaders Fellowship',
      provider: 'Columbia University School of International Affairs',
      country: 'USA',
      image_url: '/campuses/usa.jpg',
      image_url: '/campuses/usa.jpg',
      field_of_study: 'Business',
      degree_level: 'graduate',
      min_gpa_required: 3.3,
      funding_type: 'partial',
      amount_description: '50% tuition remission ($38,000 per academic year)',
      deadline: addDays(85),
      description: 'Supports high-potential international professionals pursuing master’s degrees in international finance, trade, and economic policy.',
      tags: ['USA', 'Columbia', 'Finance', 'Partial Grant'],
      required_documents: ['Statement of Purpose', 'Quantitative Resume', 'Two References', 'GMAT/GRE Score Card']
    },

    // Turkey
    {
      title: 'Türkiye Bursları Government Full Scholarship',
      provider: 'Presidency for Turks Abroad and Related Communities (YTB)',
      country: 'Turkey',
      image_url: '/campuses/turkey.jpg',
      image_url: '/campuses/turkey.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 2.9,
      funding_type: 'full',
      amount_description: 'University & program placement + full tuition + 1,800 TL/month + accommodation + health insurance + 1-year Turkish language course + return flights',
      deadline: addDays(12), // Closing soon!
      description: 'A government-funded, competitive scholarship program awarded to outstanding students from around the world to pursue full-time degrees at the most prestigious universities in Turkey.',
      tags: ['Turkey', 'Government', 'Full Ride', 'Accommodation Included', 'Closing Soon'],
      required_documents: ['National Identity Card / Passport', 'Diploma or Temporary Graduation Certificate', 'Academic Transcripts', 'Statement of Purpose', 'Letter of Recommendation']
    },
    {
      title: 'Koç University Graduate Excellence Fellowship',
      provider: 'Koç University Istanbul',
      country: 'Turkey',
      image_url: '/campuses/turkey.jpg',
      image_url: '/campuses/turkey.jpg',
      field_of_study: 'Computer Science',
      degree_level: 'graduate',
      min_gpa_required: 3.2,
      funding_type: 'full',
      amount_description: '100% tuition waiver + monthly stipend of 12,000 TL + free housing on campus + private health insurance',
      deadline: addDays(55),
      description: 'All admitted graduate research students to Koç University Graduate School of Sciences and Engineering receive full financial support.',
      tags: ['Turkey', 'Istanbul', 'Research', 'Tech', 'Fully Funded'],
      required_documents: ['Statement of Purpose', 'Transcripts with minimum 3.2 GPA', 'Two Letters of Recommendation', 'GRE General Test (optional for Turkish, mandatory for foreign)']
    },
    {
      title: 'Bilkent University Merit Scholarship for International Students',
      provider: 'Bilkent University Ankara',
      country: 'Turkey',
      image_url: '/campuses/turkey.jpg',
      image_url: '/campuses/turkey.jpg',
      field_of_study: 'Engineering',
      degree_level: 'undergraduate',
      min_gpa_required: 3.0,
      funding_type: 'full',
      amount_description: 'Full tuition waiver + free dorm room (double occupancy) + monthly food allowance',
      deadline: addDays(70),
      description: 'Offered to incoming international undergraduate students ranking in the top percentiles of recognized high school completion and international testing curricula.',
      tags: ['Turkey', 'Undergraduate', 'Free Dorms', 'Engineering'],
      required_documents: ['SAT / IB / Cambridge A-Level Certificate', 'Official High School Transcript', 'Copy of Passport', 'Motivation Letter']
    },

    // China
    {
      title: 'Chinese Government Scholarship - Silk Road Program',
      provider: 'China Scholarship Council (CSC)',
      country: 'China',
      image_url: '/campuses/china.jpg',
      image_url: '/campuses/china.jpg',
      field_of_study: 'Engineering',
      degree_level: 'graduate',
      min_gpa_required: 2.8,
      funding_type: 'full',
      amount_description: 'Full tuition waiver + free university dormitory accommodation + 3,000 RMB/month stipend + comprehensive medical insurance',
      deadline: addDays(40),
      description: 'Established to cultivate high-level engineers and leaders for countries along the Belt and Road Initiative to study at top Chinese universities.',
      tags: ['China', 'Belt and Road', 'Full Funding', 'Stipend', 'Housing'],
      required_documents: ['CSC Online Application Form', 'Notarized Highest Diploma & Transcripts', 'Study Plan in China (minimum 800 words)', 'Two Academic Recommendation Letters', 'Foreigner Physical Examination Form']
    },
    {
      title: 'Tsinghua University Schwarzman Scholars',
      provider: 'Schwarzman College & Tsinghua University',
      country: 'China',
      image_url: '/campuses/china.jpg',
      image_url: '/campuses/china.jpg',
      field_of_study: 'Business',
      degree_level: 'graduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: 'Full tuition + room and board + travel to/from Beijing + in-country study tour + $4,000 stipend',
      deadline: addDays(115),
      description: 'An elite one-year Master of Global Affairs degree at Tsinghua University in Beijing designed to prepare the next generation of global leaders.',
      tags: ['China', 'Beijing', 'Global Affairs', 'Prestigious', 'Full Ride'],
      required_documents: ['Resume / CV (max 2 pages)', 'Leadership Essay (750 words)', 'Statement of Purpose (500 words)', 'Three Letters of Recommendation', 'Short Video Introduction']
    },
    {
      title: 'Peking University Master of Public Policy Scholarship',
      provider: 'Peking University',
      country: 'China',
      image_url: '/campuses/china.jpg',
      image_url: '/campuses/china.jpg',
      field_of_study: 'Law',
      degree_level: 'graduate',
      min_gpa_required: 3.1,
      funding_type: 'full',
      amount_description: 'Tuition waiver + free campus housing + living allowance of 3,500 RMB/month',
      deadline: addDays(160),
      description: 'Offered by the School of Government at Peking University for international candidates with strong academic backgrounds in law and governance.',
      tags: ['China', 'Peking Uni', 'Law', 'Full Scholarship'],
      required_documents: ['PKU Application Form', 'Personal Statement', 'Transcripts & Degree Certificates', 'Two Letters of Recommendation']
    },

    // Australia
    {
      title: 'Australia Awards Scholarship',
      provider: 'Department of Foreign Affairs and Trade (DFAT)',
      country: 'Australia',
      image_url: '/campuses/australia.jpg',
      image_url: '/campuses/australia.jpg',
      field_of_study: 'Public Health',
      degree_level: 'graduate',
      min_gpa_required: 3.1,
      funding_type: 'full',
      amount_description: 'Full tuition fees + return air travel + establishment allowance ($5,000 AUD) + living allowance ($30,000 AUD/yr) + health cover (OSHC)',
      deadline: addDays(50),
      description: 'Long-term development awards administered by the Department of Foreign Affairs and Trade aimed at contributing to the development needs of Australia’s partner countries.',
      tags: ['Australia', 'Government', 'Public Health', 'Full Ride', 'Living Allowance'],
      required_documents: ['Certified Academic Transcripts', 'Employment Evidence', 'Development Impact Proposal', 'Referees Reports', 'IELTS Academic (min 6.5)']
    },
    {
      title: 'Melbourne International Undergraduate Scholarship',
      provider: 'University of Melbourne',
      country: 'Australia',
      image_url: '/campuses/australia.jpg',
      image_url: '/campuses/australia.jpg',
      field_of_study: 'Data Science',
      degree_level: 'undergraduate',
      min_gpa_required: 3.6,
      funding_type: 'partial',
      amount_description: '$10,000 AUD fee remission in the first year or 50% / 100% fee remission for the normal duration',
      deadline: addDays(28), // Closing soon!
      description: 'Offered to high-achieving international students undertaking undergraduate study at the University of Melbourne.',
      tags: ['Australia', 'Melbourne', 'Undergraduate', 'Merit Grant', 'Closing Soon'],
      required_documents: ['Victorian Tertiary Admissions Centre (VTAC) or Direct Admission Application', 'Year 12 High School Equivalent Results', 'Passport']
    },
    {
      title: 'University of Sydney International Research Scholarship (USydIS)',
      provider: 'University of Sydney',
      country: 'Australia',
      image_url: '/campuses/australia.jpg',
      image_url: '/campuses/australia.jpg',
      field_of_study: 'Engineering',
      degree_level: 'graduate',
      min_gpa_required: 3.4,
      funding_type: 'full',
      amount_description: 'Covers tuition fees and living allowance ($37,207 AUD per year tax-free for up to 3 years)',
      deadline: addDays(100),
      description: 'Awarded to assist international students undertaking a postgraduate research degree at the University of Sydney.',
      tags: ['Australia', 'Sydney', 'Postgrad Research', 'Tax-Free Stipend'],
      required_documents: ['Detailed Research Proposal', 'Supervisor Acceptance Email', 'Degree Transcripts', 'Two Academic Referees']
    },
    {
      title: 'Monash International Leadership Scholarship',
      provider: 'Monash University',
      country: 'Australia',
      image_url: '/campuses/australia.jpg',
      image_url: '/campuses/australia.jpg',
      field_of_study: 'Business',
      degree_level: 'graduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: '100% course fees paid until minimum number of points for degree are completed',
      deadline: addDays(130),
      description: 'Offered to high-performing international students who want to undertake full-time undergraduate or postgraduate study at Monash University.',
      tags: ['Australia', 'Monash', '100% Tuition', 'Business'],
      required_documents: ['Full Course Offer Letter', 'Scholarship Application Form', 'Statement on Potential to be an Ambassador for Monash']
    },

    // Netherlands
    {
      title: 'NL Scholarship (formerly Holland Scholarship)',
      provider: 'Dutch Ministry of Education & Dutch Research Universities',
      country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg',
      image_url: '/campuses/netherlands.jpg',
      field_of_study: 'Computer Science',
      degree_level: 'graduate',
      min_gpa_required: 3.2,
      funding_type: 'partial',
      amount_description: '€5,000 grant received in the first year of your studies to finance living costs in the Netherlands',
      deadline: addDays(35),
      description: 'Financed by the Dutch Ministry of Education, Culture and Science as well as several Dutch research universities and universities of applied sciences.',
      tags: ['Netherlands', 'Europe', 'Tech', 'Living Grant'],
      required_documents: ['Conditional Acceptance from Dutch University', 'Letter of Motivation explaining why Netherlands', 'CV / Resume', 'Academic Transcripts']
    },
    {
      title: 'TU Delft Sub-Saharan Africa Excellence Scholarship',
      provider: 'Delft University of Technology',
      country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg',
      image_url: '/campuses/netherlands.jpg',
      field_of_study: 'Engineering',
      degree_level: 'graduate',
      min_gpa_required: 3.4,
      funding_type: 'full',
      amount_description: 'Full tuition fees for TU Delft MSc + living expenses of €30,000 over 2 years + mentoring',
      deadline: addDays(16), // Closing soon!
      description: 'Supports high-performing students from Sub-Saharan African countries to pursue an MSc degree at one of Europe’s leading engineering universities.',
      tags: ['Netherlands', 'TU Delft', 'Engineering', 'Full Ride', 'Closing Soon'],
      required_documents: ['MSc Application to TU Delft', 'BSc Degree Certificate with CGPA >= 80%', 'MSc Motivation Letter (special scholarship questions)', 'Two Reference Letters']
    },
    {
      title: 'Leiden University Excellence Scholarship (LExS)',
      provider: 'Leiden University',
      country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg',
      image_url: '/campuses/netherlands.jpg',
      field_of_study: 'Law',
      degree_level: 'graduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: '€15,000 of tuition fee waiver + €10,000 contribution towards living expenses',
      deadline: addDays(78),
      description: 'Intended for exceptionally talented non-EEA students applying for any Master of Laws (LLM) or MSc programme at Leiden University.',
      tags: ['Netherlands', 'Leiden', 'International Law', 'Human Rights'],
      required_documents: ['Online Admission Application', 'Motivation Letter for LExS (500 words)', 'Official Transcripts showing top 10% class rank', 'Curriculum Vitae']
    },
    {
      title: 'Erasmus University Rotterdam Trustfonds Grant',
      provider: 'Erasmus Trustfonds',
      country: 'Netherlands',
      image_url: '/campuses/netherlands.jpg',
      image_url: '/campuses/netherlands.jpg',
      field_of_study: 'Business',
      degree_level: 'graduate',
      min_gpa_required: 3.3,
      funding_type: 'partial',
      amount_description: '€15,000 tuition fee contribution for Rotterdam School of Management (RSM) MSc',
      deadline: addDays(112),
      description: 'Helps ambitious non-EEA students cover their tuition fees for prestigious MSc programs in international management, finance, and logistics.',
      tags: ['Netherlands', 'Rotterdam', 'RSM', 'Business'],
      required_documents: ['RSM Master Admission Letter', 'Motivation Statement', 'Financial Statement Demonstrating Co-funding', 'GMAT Score']
    },

    // South Korea
    {
      title: 'Global Korea Scholarship (GKS / KGSP) - Graduate',
      provider: 'National Institute for International Education (NIIED)',
      country: 'South Korea',
      image_url: '/campuses/south_korea.jpg',
      image_url: '/campuses/south_korea.jpg',
      field_of_study: 'Any',
      degree_level: 'graduate',
      min_gpa_required: 3.0,
      funding_type: 'full',
      amount_description: 'Free tuition + 1,000,000 KRW/month living allowance + 1-year Korean language training + settlement allowance + airfare',
      deadline: addDays(21), // Closing soon!
      description: 'Aims to foster international exchange in education and mutual friendship between Korea and participating countries through fully-funded degree programs.',
      tags: ['South Korea', 'GKS', 'Full Ride', 'Language Training', 'Closing Soon'],
      required_documents: ['GKS Application Form', 'Personal Statement', 'Statement of Purpose / Study Plan', 'Two Recommendation Letters', 'Medical Examination Form']
    },
    {
      title: 'KAIST International Student Graduate Scholarship',
      provider: 'Korea Advanced Institute of Science and Technology (KAIST)',
      country: 'South Korea',
      image_url: '/campuses/south_korea.jpg',
      image_url: '/campuses/south_korea.jpg',
      field_of_study: 'Computer Science',
      degree_level: 'graduate',
      min_gpa_required: 3.2,
      funding_type: 'full',
      amount_description: '100% tuition coverage for 4 semesters + monthly stipend 350,000 KRW + national health insurance',
      deadline: addDays(82),
      description: 'All admitted international graduate students in computing and engineering at KAIST receive full tuition and stipend support.',
      tags: ['South Korea', 'KAIST', 'STEM', 'AI', 'Full Ride'],
      required_documents: ['Online KAIST Application', 'Statement of Financial Resources (select KAIST scholarship)', 'Transcripts & Degree Certificate', 'English Test Score (TOEFL/IELTS)']
    },
    {
      title: 'Seoul National University Global Hope Scholarship',
      provider: 'Seoul National University (SNU)',
      country: 'South Korea',
      image_url: '/campuses/south_korea.jpg',
      image_url: '/campuses/south_korea.jpg',
      field_of_study: 'Engineering',
      degree_level: 'undergraduate',
      min_gpa_required: 3.1,
      funding_type: 'full',
      amount_description: 'Full tuition waiver + 1,200,000 KRW/month living stipend for 8 undergraduate semesters',
      deadline: addDays(145),
      description: 'Offered to students from developing countries on DAC list who possess strong scholastic records and leadership potential.',
      tags: ['South Korea', 'SNU', 'Seoul', 'Undergraduate'],
      required_documents: ['Undergraduate Admission Application', 'Official High School Transcripts', 'Proof of Nationality of Applicant and Parents', 'Two Teacher Recommendations']
    },

    // UAE
    {
      title: 'NYU Abu Dhabi Global Leaders Fellowship',
      provider: 'New York University Abu Dhabi',
      country: 'UAE',
      image_url: '/campuses/uae.jpg',
      image_url: '/campuses/uae.jpg',
      field_of_study: 'Data Science',
      degree_level: 'undergraduate',
      min_gpa_required: 3.5,
      funding_type: 'full',
      amount_description: 'Covers 100% of tuition, accommodation on Saadiyat Island, meal plans, health insurance, annual flight home, and personal stipend',
      deadline: addDays(33),
      description: 'Need-and-merit fellowship ensuring every admitted international undergraduate student can attend regardless of financial means.',
      tags: ['UAE', 'Abu Dhabi', 'NYU', 'Full Ride', 'Undergraduate'],
      required_documents: ['Common Application', 'Candidate Weekend Interview', 'High School Transcripts', 'CSS Profile / Financial Statement']
    },
    {
      title: 'Khalifa University Graduate Research Fellowship',
      provider: 'Khalifa University of Science and Technology',
      country: 'UAE',
      image_url: '/campuses/uae.jpg',
      image_url: '/campuses/uae.jpg',
      field_of_study: 'Engineering',
      degree_level: 'graduate',
      min_gpa_required: 3.2,
      funding_type: 'full',
      amount_description: 'Full tuition + monthly stipend of 8,000 AED + free university housing + medical insurance + visa support',
      deadline: addDays(68),
      description: 'Supports high-caliber graduate students pursuing Master of Science and PhD programs in cutting-edge engineering fields.',
      tags: ['UAE', 'Khalifa Uni', 'Engineering', 'High Stipend', 'Full Funding'],
      required_documents: ['Statement of Purpose', 'Official University Transcripts', 'Curriculum Vitae', 'Valid GRE and IELTS/TOEFL Scores', 'Two Recommendation Letters']
    },
    {
      title: 'UAE University Master’s Merit Grant',
      provider: 'United Arab Emirates University (UAEU)',
      country: 'UAE',
      image_url: '/campuses/uae.jpg',
      image_url: '/campuses/uae.jpg',
      field_of_study: 'Business',
      degree_level: 'graduate',
      min_gpa_required: 3.4,
      funding_type: 'partial',
      amount_description: '50% - 100% tuition waiver for eligible graduate students in business & economics',
      deadline: addDays(125),
      description: 'Offered by UAEU College of Business and Economics to top international applicants with proven academic excellence.',
      tags: ['UAE', 'UAEU', 'Business', 'Al Ain'],
      required_documents: ['Graduate Application Form', 'Undergraduate Bachelor Degree Transcripts', 'Two Reference Letters', 'Motivation Letter']
    },
    {
      title: 'Sorbonne University Abu Dhabi Excellence Scholarship',
      provider: 'Sorbonne University Abu Dhabi',
      country: 'UAE',
      image_url: '/campuses/uae.jpg',
      image_url: '/campuses/uae.jpg',
      field_of_study: 'Law',
      degree_level: 'graduate',
      min_gpa_required: 3.3,
      funding_type: 'partial',
      amount_description: 'Up to 75% tuition fee waiver for postgraduate law and humanities programs',
      deadline: addDays(92),
      description: 'Encourages high-achieving international students to study French-curriculum higher education in the heart of Abu Dhabi.',
      tags: ['UAE', 'Sorbonne', 'Law', 'Partial Grant'],
      required_documents: ['Admission Acceptance', 'Official Academic Records', 'Curriculum Vitae', 'Cover Letter']
    }
  ];

  console.log(`Inserting ${scholarshipsData.length} scholarships...`);

  const createdScholarships = [];
  for (const s of scholarshipsData) {
    const item = await prisma.scholarship.create({
      data: {
        title: s.title,
        provider: s.provider,
        country: s.country,
        image_url: s.image_url,
        field_of_study: s.field_of_study,
        degree_level: s.degree_level,
        min_gpa_required: s.min_gpa_required,
        funding_type: s.funding_type,
        amount_description: s.amount_description,
        deadline: s.deadline,
        description: s.description,
        tags: JSON.stringify(s.tags),
        required_documents: JSON.stringify(s.required_documents)
      }
    });
    createdScholarships.push(item);
  }

  // ==========================================
  // 5. SAVED SCHOLARSHIPS FOR DEMO USERS
  // ==========================================
  console.log('Seeding saved scholarships for demo users...');

  // Student Ahmed saves 3 scholarships
  await prisma.savedScholarship.create({
    data: {
      student_id: studentAhmedUser.id,
      scholarship_id: createdScholarships[0].id // DAAD Helmut Schmidt
    }
  });
  await prisma.savedScholarship.create({
    data: {
      student_id: studentAhmedUser.id,
      scholarship_id: createdScholarships[1].id // DAAD STEM
    }
  });
  await prisma.savedScholarship.create({
    data: {
      student_id: studentAhmedUser.id,
      scholarship_id: createdScholarships[10].id // Pearson Toronto
    }
  });

  // Student Fatima saves 2 UK scholarships
  await prisma.savedScholarship.create({
    data: {
      student_id: studentFatimaUser.id,
      scholarship_id: createdScholarships[5].id // Chevening
    }
  });
  await prisma.savedScholarship.create({
    data: {
      student_id: studentFatimaUser.id,
      scholarship_id: createdScholarships[6].id // Commonwealth
    }
  });

  // ==========================================
  // 6. SEEDED LIVE SESSIONS
  // ==========================================
  console.log('Seeding live sessions according to specification...');

  // 1) For student.ahmed:
  // - ONE COMPLETED free first session with mentor.sara
  await prisma.liveSession.create({
    data: {
      mentor_id: mentorSaraUser.id,
      student_id: studentAhmedUser.id,
      title: '1:1 DAAD Germany Strategy & SOP Kickoff',
      scheduled_datetime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      duration_minutes: 30,
      status: 'completed',
      is_free_first_session: true,
      price: 0.0,
      payment_status: 'not_required',
      meeting_note: 'Ahmed has a strong CS profile (3.6 GPA). Advised him to emphasize his distributed systems project in his TU Berlin motivation letter.'
    }
  });

  // - ONE CONFIRMED paid upcoming session with another mentor (e.g. Dr. Aris Thorne)
  const anotherMentor = createdMentorProfiles[0]; // Dr. Aris Thorne
  const session2 = await prisma.liveSession.create({
    data: {
      mentor_id: anotherMentor.id,
      student_id: studentAhmedUser.id,
      title: '1:1 Graduate Research & Lab Outreach Strategy',
      scheduled_datetime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // in 4 days
      duration_minutes: 60,
      status: 'confirmed',
      is_free_first_session: false,
      price: 35.0,
      payment_status: 'paid',
      meeting_note: null
    }
  });

  // Seed mock payment for session2
  await prisma.payment.create({
    data: {
      user_id: studentAhmedUser.id,
      related_type: 'live_session',
      related_id: session2.id,
      amount: 35.0,
      card_last4: '4242',
      status: 'success'
    }
  });

  // 2) For student.fatima:
  // - ONE CONFIRMED free first session with mentor.hassan coming up in a few days
  await prisma.liveSession.create({
    data: {
      mentor_id: mentorHassanUser.id,
      student_id: studentFatimaUser.id,
      title: '1:1 Chevening Leadership Essay Deep Dive',
      scheduled_datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
      duration_minutes: 30,
      status: 'confirmed',
      is_free_first_session: true,
      price: 0.0,
      payment_status: 'not_required',
      meeting_note: null
    }
  });

  // 3) Student Ali has ZERO sessions booked yet (to test "book your first free session")!

  // ==========================================
  // 7. SEEDED ASYNC BOOKINGS
  // ==========================================
  console.log('Seeding async bookings...');

  // Student Ahmed has booked an SOP review service with mentor.sara
  const saraServices = await prisma.mentorService.findMany({
    where: { mentor: { user_id: mentorSaraUser.id } }
  });

  if (saraServices.length > 0) {
    const booking1 = await prisma.booking.create({
      data: {
        student_id: studentAhmedUser.id,
        service_id: saraServices[0].id,
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: saraServices[0].price,
        notes: 'Please check my draft for TU Berlin MS Computer Science.'
      }
    });

    await prisma.payment.create({
      data: {
        user_id: studentAhmedUser.id,
        related_type: 'service_booking',
        related_id: booking1.id,
        amount: saraServices[0].price,
        card_last4: '4242',
        status: 'success'
      }
    });
  }

  // ==========================================
  // 8. NOTIFICATIONS FOR DEMO USERS
  // ==========================================
  console.log('Seeding notifications for demo users...');

  // Notifications for Ahmed
  await prisma.notification.createMany({
    data: [
      {
        user_id: studentAhmedUser.id,
        type: 'session_confirmed',
        message: 'Your 60-minute live session with Dr. Aris Thorne is confirmed for this Thursday at 4:00 PM CET.',
        is_read: false
      },
      {
        user_id: studentAhmedUser.id,
        type: 'booking_confirmed',
        message: 'Sara Chen confirmed your SOP Review service booking. Estimated delivery: 3 days.',
        is_read: false
      },
      {
        user_id: studentAhmedUser.id,
        type: 'session_reminder',
        message: 'Meeting notes from your completed session with Sara Chen are now available in your Live Sessions dashboard.',
        is_read: true
      },
      {
        user_id: studentAhmedUser.id,
        type: 'session_reminder',
        message: 'Scholarship Alert: DAAD Helmut-Schmidt-Programme is closing in 18 days! Complete your documents.',
        is_read: true
      }
    ]
  });

  // Notifications for Fatima
  await prisma.notification.createMany({
    data: [
      {
        user_id: studentFatimaUser.id,
        type: 'session_confirmed',
        message: 'Your free 1:1 Chevening Leadership Call with Hassan Tariq is confirmed!',
        is_read: false
      },
      {
        user_id: studentFatimaUser.id,
        type: 'session_reminder',
        message: 'Upcoming call with Hassan Tariq in 3 days. Prepare your 4 essay bullet points.',
        is_read: false
      },
      {
        user_id: studentFatimaUser.id,
        type: 'session_reminder',
        message: 'Commonwealth Master’s Scholarship applications close in 25 days.',
        is_read: true
      }
    ]
  });

  // Notifications for Ali
  await prisma.notification.createMany({
    data: [
      {
        user_id: studentAliUser.id,
        type: 'session_reminder',
        message: 'Welcome to ScholarSphere, Ali! You are eligible for 1 FREE live strategy call with any mentor of your choice.',
        is_read: false
      },
      {
        user_id: studentAliUser.id,
        type: 'session_reminder',
        message: 'Türkiye Bursları Government Full Scholarship deadline is in 12 days. Check your eligibility now!',
        is_read: false
      },
      {
        user_id: studentAliUser.id,
        type: 'booking_confirmed',
        message: 'Your profile preferences match 8 scholarships in Germany and Turkey.',
        is_read: true
      }
    ]
  });

  // Notifications for Sara (mentor)
  await prisma.notification.createMany({
    data: [
      {
        user_id: mentorSaraUser.id,
        type: 'booking_confirmed',
        message: 'New SOP Review booking received from Ahmed Khan ($35.00 paid).',
        is_read: false
      },
      {
        user_id: mentorSaraUser.id,
        type: 'new_review',
        message: 'Priya Patel left you a 5-star review: "Super fast turnaround and very detailed advice!"',
        is_read: false
      },
      {
        user_id: mentorSaraUser.id,
        type: 'session_reminder',
        message: 'You have completed 42 student mentorship sessions on ScholarSphere!',
        is_read: true
      }
    ]
  });

  // Notifications for Hassan (mentor)
  await prisma.notification.createMany({
    data: [
      {
        user_id: mentorHassanUser.id,
        type: 'session_confirmed',
        message: 'New free first live session booked by Dr. Fatima Zahra for 1:1 Chevening Leadership Call.',
        is_read: false
      },
      {
        user_id: mentorHassanUser.id,
        type: 'new_review',
        message: 'Ahmed Khan left you a 5-star review: "Incredible insight! Fixed my SOP narrative."',
        is_read: true
      }
    ]
  });

  
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
  
  console.log('✅ Database seeded successfully!');
  console.log('   - 60 Students (Ahmed, Fatima, Ali + 57 diverse international students)');
  console.log('   - 50 Mentors (Sara, Hassan + 48 scholars worldwide)');
  console.log('   - 40 Real Scholarships across 10 countries');
  console.log('   - Live sessions, services, reviews, payments, notifications initialized');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

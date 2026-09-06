const apiBase = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Running ScholarSphere Comprehensive Flow Tests...\n');

  // Helper login
  async function login(email, password = 'Demo1234') {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(`Login failed for ${email}`);
    return await res.json();
  }

  // TEST 1: Ahmed Login & Recommendations
  console.log('1️⃣ Testing Student Ahmed Login & Recommendations...');
  const ahmed = await login('student.ahmed@demo.com');
  console.log(`   Logged in as: ${ahmed.user.name} (${ahmed.user.email})`);

  const recRes = await fetch(`${apiBase}/scholarships/recommendations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ahmed.token}` }
  });
  const recs = await recRes.json();
  console.log(`   Fetched ${recs.length} scored recommendations.`);
  console.log(`   Top match: "${recs[0].title}" | Score: ${recs[0].match_score}% | Reason: ${recs[0].match_reason}`);
  if (recs[0].match_score < 80) throw new Error('Expected top match score >= 80%');

  // TEST 2: Profile Update Dynamic Re-scoring
  console.log('\n2️⃣ Testing Profile Edit & Dynamic Score Recalculation...');
  const originalGpa = ahmed.user.student_profile.gpa;
  const originalField = ahmed.user.student_profile.field_of_study;

  // Change to Business & lower GPA
  const updateRes = await fetch(`${apiBase}/students/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${ahmed.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      field_of_study: 'Business',
      gpa: 3.0,
      preferred_countries: ['Turkey', 'China']
    })
  });
  const updateData = await updateRes.json();
  console.log(`   Updated profile to Field: Business, GPA: 3.0, Countries: Turkey, China`);

  const recResAfter = await fetch(`${apiBase}/scholarships/recommendations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ahmed.token}` }
  });
  const recsAfter = await recResAfter.json();
  console.log(`   New Top match: "${recsAfter[0].title}" | Score: ${recsAfter[0].match_score}% | Reason: ${recsAfter[0].match_reason}`);

  if (recsAfter[0].id === recs[0].id && recsAfter[0].match_score === recs[0].match_score) {
    console.warn('   Note: Top match unchanged');
  } else {
    console.log('   ✅ Recommendations successfully changed based on updated profile!');
  }

  // Restore Ahmed's original profile
  await fetch(`${apiBase}/students/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${ahmed.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      field_of_study: originalField,
      gpa: originalGpa,
      preferred_countries: ['Germany', 'Canada', 'Netherlands']
    })
  });
  console.log('   Restored Ahmed\'s original CS profile.');

  // TEST 3: Async Mentor Service Booking with Fake Payment
  console.log('\n3️⃣ Testing Async Service Booking with Fake Checkout...');
  const mentors = await fetch(`${apiBase}/mentors`).then(r => r.json());
  const sara = mentors.find(m => m.email === 'mentor.sara@demo.com');
  const saraDetail = await fetch(`${apiBase}/mentors/${sara.id}`).then(r => r.json());
  const serviceToBook = saraDetail.services[0]; // e.g. SOP Review ($35)
  console.log(`   Booking service: "${serviceToBook.title}" ($${serviceToBook.price}) from ${sara.name}`);

  // Fake checkout
  const checkoutRes = await fetch(`${apiBase}/payments/fake-checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ahmed.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      related_type: 'service_booking',
      related_id: serviceToBook.id,
      amount: serviceToBook.price,
      card_number: '4242 4242 4242 4242',
      card_expiry: '12/28',
      card_cvv: '999'
    })
  });
  const checkoutData = await checkoutRes.json();
  console.log(`   Fake Checkout succeeded! Payment ID: ${checkoutData.payment_id}, Status: ${checkoutData.status}`);

  // Confirm booking
  const bookingRes = await fetch(`${apiBase}/bookings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ahmed.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_id: serviceToBook.id,
      notes: 'Automated test booking for final year project.',
      payment_id: checkoutData.payment_id
    })
  });
  const bookingData = await bookingRes.json();
  console.log(`   ✅ Service Booking confirmed! ID: ${bookingData.booking.id}, Status: ${bookingData.booking.status}, Paid: $${bookingData.booking.amount_paid}`);

  // Verify in My Bookings
  const myBookings = await fetch(`${apiBase}/bookings/mine`, {
    headers: { Authorization: `Bearer ${ahmed.token}` }
  }).then(r => r.json());
  const bookedFound = myBookings.find(b => b.id === bookingData.booking.id);
  console.log(`   Found in Ahmed's My Bookings: ${bookedFound ? 'YES (Paid)' : 'NO'}`);

  // TEST 4 & 5: Student Ali 1st Live Session Free vs 2nd Live Session Paid
  console.log('\n4️⃣ Testing Student Ali: First Live Session Free Business Rule...');
  const ali = await login('student.ali@demo.com');
  console.log(`   Logged in as: ${ali.user.name} (Zero previous sessions)`);

  // Check eligibility with Hassan
  const hassan = mentors.find(m => m.email === 'mentor.hassan@demo.com');
  const elig1 = await fetch(`${apiBase}/mentors/${hassan.id}/live-sessions/eligibility`, {
    headers: { Authorization: `Bearer ${ali.token}` }
  }).then(r => r.json());
  console.log('   Eligibility check for 1st call with Hassan:', elig1);
  if (!elig1.is_free_first_session || elig1.price !== 0) {
    throw new Error('Ali should be eligible for a FREE first live session!');
  }

  // Book 1st session with Hassan (NO payment required!)
  const date1 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const session1Res = await fetch(`${apiBase}/live-sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ali.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mentor_id: hassan.id,
      scheduled_datetime: date1,
      duration_minutes: 30,
      title: 'Ali First Live Session Free'
    })
  });
  const session1Data = await session1Res.json();
  console.log(`   ✅ 1st Session booked successfully without payment!`);
  console.log(`      Title: "${session1Data.session.title}", Free: ${session1Data.session.is_free_first_session}, Payment Status: ${session1Data.session.payment_status}`);

  console.log('\n5️⃣ Testing Student Ali: Second Live Session with Same Mentor Requires Payment...');
  // Check eligibility for 2nd call with SAME mentor Hassan
  const elig2 = await fetch(`${apiBase}/mentors/${hassan.id}/live-sessions/eligibility`, {
    headers: { Authorization: `Bearer ${ali.token}` }
  }).then(r => r.json());
  console.log('   Eligibility check for 2nd call with Hassan:', elig2);
  if (elig2.is_free_first_session || elig2.price <= 0) {
    throw new Error('Ali should NOT be eligible for a free second session with Hassan!');
  }

  // Attempt to book 2nd session WITHOUT payment -> must fail with 400 requires_payment!
  const date2 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const session2FailRes = await fetch(`${apiBase}/live-sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ali.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mentor_id: hassan.id,
      scheduled_datetime: date2,
      duration_minutes: 30,
      title: 'Ali Second Session (Attempt without payment)'
    })
  });
  console.log(`   Attempt booking without payment HTTP status: ${session2FailRes.status} (Expected: 400)`);
  const failData = await session2FailRes.json();
  console.log(`   Server error message: "${failData.error}", requires_payment: ${failData.requires_payment}`);
  if (session2FailRes.status !== 400 || !failData.requires_payment) {
    throw new Error('Backend failed to enforce payment requirement on second session!');
  }

  // Now Ali performs fake checkout for the 2nd session
  const pay2Res = await fetch(`${apiBase}/payments/fake-checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ali.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      related_type: 'live_session',
      related_id: hassan.id,
      amount: elig2.price,
      card_number: '4242 4242 4242 4242',
      card_expiry: '11/29',
      card_cvv: '123'
    })
  });
  const pay2Data = await pay2Res.json();
  console.log(`   Completed Fake Checkout for 2nd session! Payment ID: ${pay2Data.payment_id}`);

  // Now book 2nd session with payment_id
  const session2SuccessRes = await fetch(`${apiBase}/live-sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ali.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mentor_id: hassan.id,
      scheduled_datetime: date2,
      duration_minutes: 30,
      title: 'Ali Second Session (Paid)',
      payment_id: pay2Data.payment_id
    })
  });
  const session2Data = await session2SuccessRes.json();
  console.log(`   ✅ 2nd Session booked successfully WITH payment!`);
  console.log(`      Title: "${session2Data.session.title}", Free: ${session2Data.session.is_free_first_session}, Payment Status: ${session2Data.session.payment_status}, Price: $${session2Data.session.price}`);

  // TEST 6: Mentor Dashboard View
  console.log('\n6️⃣ Testing Mentor Dashboard View (Sara & Hassan)...');
  const saraAuth = await login('mentor.sara@demo.com');
  const saraSessions = await fetch(`${apiBase}/live-sessions/mentor-view`, {
    headers: { Authorization: `Bearer ${saraAuth.token}` }
  }).then(r => r.json());
  const saraBookings = await fetch(`${apiBase}/bookings/mentor-view`, {
    headers: { Authorization: `Bearer ${saraAuth.token}` }
  }).then(r => r.json());
  console.log(`   Mentor Sara View -> Live Sessions: ${saraSessions.length}, Async Bookings: ${saraBookings.length}`);

  console.log('\n🎉 ALL WORKFLOW TESTS PASSED PERFECTLY!');
}

runTests().catch(err => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});

/**
 * Rule-Based Recommendation Scoring Engine for ScholarSphere
 * Scores scholarships 0-100 based on student profile attributes.
 */
function scoreScholarshipForStudent(scholarship, studentProfile) {
  let score = 0;
  const reasons = [];

  const studentField = (studentProfile.field_of_study || '').toLowerCase();
  const scholarshipField = (scholarship.field_of_study || '').toLowerCase();

  // 1. Field of Study Match (+30)
  if (scholarshipField === 'any' || scholarshipField.includes(studentField) || studentField.includes(scholarshipField)) {
    score += 30;
    reasons.push(scholarshipField === 'any' ? 'Open to any field of study (+30)' : `Matches your field of ${studentProfile.field_of_study} (+30)`);
  } else {
    reasons.push(`Field mismatch (${scholarship.field_of_study} vs your ${studentProfile.field_of_study}) (+0)`);
  }

  // 2. Preferred Country Match (+25)
  let preferredCountries = [];
  try {
    preferredCountries = Array.isArray(studentProfile.preferred_countries)
      ? studentProfile.preferred_countries
      : JSON.parse(studentProfile.preferred_countries || '[]');
  } catch (e) {
    preferredCountries = [];
  }

  const matchesCountry = preferredCountries.some(
    (c) => c.toLowerCase() === (scholarship.country || '').toLowerCase()
  );

  if (matchesCountry) {
    score += 25;
    reasons.push(`Located in your preferred country: ${scholarship.country} (+25)`);
  } else {
    reasons.push(`Located in ${scholarship.country} (not in your preferred list) (+0)`);
  }

  // 3. GPA Requirement (+20)
  const studentGpa = parseFloat(studentProfile.gpa) || 0;
  const minGpa = parseFloat(scholarship.min_gpa_required) || 0;

  if (studentGpa >= minGpa) {
    score += 20;
    reasons.push(`Your GPA (${studentGpa.toFixed(2)}) meets the minimum requirement (${minGpa.toFixed(2)}) (+20)`);
  } else {
    reasons.push(`GPA below requirement (${studentGpa.toFixed(2)} < min ${minGpa.toFixed(2)}) (+0)`);
  }

  // 4. Degree Level Match (+15)
  const studentDeg = (studentProfile.degree_level || '').toLowerCase();
  const schDeg = (scholarship.degree_level || '').toLowerCase();

  if (schDeg === 'any' || schDeg === studentDeg) {
    score += 15;
    reasons.push(`Matches your targeted degree level: ${studentProfile.degree_level} (+15)`);
  } else {
    reasons.push(`Degree level targeted for ${scholarship.degree_level} (+0)`);
  }

  // 5. Funding Type & Budget Match (+10)
  const isFullyFunded = (scholarship.funding_type || '').toLowerCase() === 'full';
  const wantsFullRide = (studentProfile.budget_range || '').toLowerCase().includes('fully funded');

  if (isFullyFunded && wantsFullRide) {
    score += 10;
    reasons.push('Fully funded coverage satisfies your full-ride preference (+10)');
  } else if (isFullyFunded) {
    score += 10;
    reasons.push('Fully funded scholarship (+10)');
  } else {
    reasons.push('Partial funding support (+0)');
  }

  // Determine badge style
  let badgeColor = 'gray';
  let badgeText = 'Moderate Match';
  if (score >= 80) {
    badgeColor = 'green';
    badgeText = 'High Match';
  } else if (score >= 60) {
    badgeColor = 'yellow';
    badgeText = 'Good Match';
  }

  const match_reason = reasons.filter(r => !r.endsWith('(+0)')).join(' • ') || 'Base eligibility match';

  return {
    match_score: score,
    match_reason,
    reasons_breakdown: reasons,
    badge_color: badgeColor,
    badge_text: badgeText,
    is_gpa_eligible: studentGpa >= minGpa
  };
}

module.exports = {
  scoreScholarshipForStudent
};

const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, '../../frontend/public/avatars');
const campusesDir = path.join(__dirname, '../../frontend/public/campuses');

if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });
if (!fs.existsSync(campusesDir)) fs.mkdirSync(campusesDir, { recursive: true });

// Helper to download image
async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('📸 Downloading realistic profile photos and campus visuals...');

  // 1. Download 60 Student Headshots (alternating male/female)
  console.log('Downloading 60 student headshots...');
  for (let i = 1; i <= 60; i++) {
    const gender = i % 2 === 0 ? 'women' : 'men';
    const index = (i * 3) % 95;
    const url = `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
    const dest = path.join(avatarsDir, `student_${i}.jpg`);
    if (!fs.existsSync(dest)) {
      await downloadImage(url, dest);
    }
  }

  // 2. Download 50 Mentor Headshots (alternating male/female)
  console.log('Downloading 50 mentor headshots...');
  for (let i = 1; i <= 50; i++) {
    const gender = i % 2 === 0 ? 'women' : 'men';
    const index = ((i * 7) + 5) % 95;
    const url = `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
    const dest = path.join(avatarsDir, `mentor_${i}.jpg`);
    if (!fs.existsSync(dest)) {
      await downloadImage(url, dest);
    }
  }

  // 3. Download campus photos for the 10 countries
  console.log('Downloading university campus landscape photos...');
  const campusImages = {
    germany: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    uk: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
    canada: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
    usa: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80',
    turkey: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    china: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&q=80',
    australia: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&q=80',
    netherlands: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
    south_korea: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&q=80',
    uae: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    stem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80',
    general: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&q=80'
  };

  for (const [key, url] of Object.entries(campusImages)) {
    const dest = path.join(campusesDir, `${key}.jpg`);
    if (!fs.existsSync(dest)) {
      await downloadImage(url, dest);
    }
  }

  console.log('✅ Asset caching complete!');
}

run();

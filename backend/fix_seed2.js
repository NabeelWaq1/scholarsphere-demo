const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

// replace `const studentAhmedUser = await prisma.user.findUnique...`
// Since I appended this block, I can just replace `const studentAhmedUser = await prisma.user.findUnique` with `// `
content = content.replace(/const studentAhmedUser = await prisma\.user\.findUnique\(\{ where: \{ email: 'student\.ahmed@demo\.com' \} \}\);/g, '');
content = content.replace(/const studentFatimaUser = await prisma\.user\.findUnique\(\{ where: \{ email: 'student\.fatima@demo\.com' \} \}\);/g, '');
content = content.replace(/const studentAliUser = await prisma\.user\.findUnique\(\{ where: \{ email: 'student\.ali@demo\.com' \} \}\);/g, '');
content = content.replace(/const mentorSaraUser = await prisma\.user\.findUnique\(\{ where: \{ email: 'mentor\.sara@demo\.com' \} \}\);/g, '');
content = content.replace(/const mentorHassanUser = await prisma\.user\.findUnique\(\{ where: \{ email: 'mentor\.hassan@demo\.com' \} \}\);/g, '');

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Fixed redeclarations in seed.js');

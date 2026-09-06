const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

// replace `const studentAhmedUser` with `let studentAhmedUser_ref` or just rename them
content = content.replace(/const studentAhmedUser = await prisma\.user\.findUnique/g, 'const studentAhmedUser_ref = await prisma.user.findUnique');
content = content.replace(/const studentFatimaUser = await prisma\.user\.findUnique/g, 'const studentFatimaUser_ref = await prisma.user.findUnique');
content = content.replace(/const studentAliUser = await prisma\.user\.findUnique/g, 'const studentAliUser_ref = await prisma.user.findUnique');
content = content.replace(/const mentorSaraUser = await prisma\.user\.findUnique/g, 'const mentorSaraUser_ref = await prisma.user.findUnique');
content = content.replace(/const mentorHassanUser = await prisma\.user\.findUnique/g, 'const mentorHassanUser_ref = await prisma.user.findUnique');

// also replace the usages in the appended block
// wait, since they are already available in the scope, I can just REMOVE those lines altogether!
content = content.replace(/const studentAhmedUser_ref = await prisma\.user\.findUnique[^\n]*\n/g, '');
content = content.replace(/const studentFatimaUser_ref = await prisma\.user\.findUnique[^\n]*\n/g, '');
content = content.replace(/const studentAliUser_ref = await prisma\.user\.findUnique[^\n]*\n/g, '');
content = content.replace(/const mentorSaraUser_ref = await prisma\.user\.findUnique[^\n]*\n/g, '');
content = content.replace(/const mentorHassanUser_ref = await prisma\.user\.findUnique[^\n]*\n/g, '');

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Fixed redeclarations correctly in seed.js');

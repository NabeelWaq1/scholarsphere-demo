const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

// The easiest way is to remove all `image_url:` lines before `const scholarshipsData = [`
const splitIndex = content.indexOf('const scholarshipsData = [');
if (splitIndex !== -1) {
  let firstPart = content.substring(0, splitIndex);
  let secondPart = content.substring(splitIndex);
  
  firstPart = firstPart.replace(/\s+image_url:\s*'[^\n]+',\n/g, '\n');
  content = firstPart + secondPart;
  
  fs.writeFileSync(seedPath, content, 'utf8');
  console.log('Fixed seed.js');
} else {
  console.log('Could not find scholarshipsData');
}

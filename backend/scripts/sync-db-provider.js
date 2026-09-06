require('dotenv').config();
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

function syncProvider() {
  if (!fs.existsSync(schemaPath)) return;

  const schema = fs.readFileSync(schemaPath, 'utf8');
  const dbUrl = (process.env.DATABASE_URL || '').trim();
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

  const match = schema.match(/datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"([^"]+)"/);

  if (match && match[1] !== targetProvider) {
    const updated = schema.replace(
      /(datasource\s+db\s*\{[\s\S]*?provider\s*=\s*")[^"]+(")/,
      `$1${targetProvider}$2`
    );
    fs.writeFileSync(schemaPath, updated, 'utf8');
    console.log(`[db-sync] Automatically updated Prisma datasource provider to "${targetProvider}" based on DATABASE_URL.`);
  }
}

syncProvider();

module.exports = syncProvider;

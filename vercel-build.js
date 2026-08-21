const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

if (process.env.VERCEL) {
  console.log('Vercel environment detected. Switching Prisma schema to PostgreSQL...');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace sqlite with postgresql
  schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
  
  // Replace DATABASE_URL with Vercel's Postgres URLs
  schema = schema.replace(/url\s*=\s*env\("DATABASE_URL"\)/, 'url = env("POSTGRES_PRISMA_URL")\n  directUrl = env("POSTGRES_URL_NON_POOLING")');
  
  fs.writeFileSync(schemaPath, schema);
  console.log('Schema updated successfully for Vercel deployment.');
} else {
  console.log('Local environment detected. Keeping SQLite configuration.');
}

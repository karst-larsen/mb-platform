import { runMigration } from 'contentful-migration';
import * as path from 'path';
import * as fs from 'fs';

const migrationsDir = path.join(__dirname, '../migrations');

async function main() {
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.ts')).sort();
  for (const file of files) {
    console.log(`Running: ${file}`);
    await runMigration({
      filePath: path.join(migrationsDir, file),
      spaceId: process.env['CONTENTFUL_SPACE_ID']!,
      accessToken: process.env['CONTENTFUL_MANAGEMENT_TOKEN']!,
      environmentId: 'master',
      yes: true,
    });
  }
}

main().catch(console.error);

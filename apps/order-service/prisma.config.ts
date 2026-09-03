import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma generate does not need a live DB; CI may only provide a placeholder URL.
const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://order:order@127.0.0.1:5432/orders?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});

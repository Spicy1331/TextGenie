/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./app/utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:1rTQRw4KnZXf@ep-quiet-mountain-a5uednvo.us-east-2.aws.neon.tech/ai-content-generator?sslmode=require'
    }
  };
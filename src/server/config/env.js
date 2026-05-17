import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3002),
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sua_autoskola',
  testDatabaseUrl: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sua_autoskola_test'
};

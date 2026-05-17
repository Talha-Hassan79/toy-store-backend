import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });
config({ path: join(process.cwd(), '../.env') });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Postgres');
}

const sslEnabled = process.env.DB_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

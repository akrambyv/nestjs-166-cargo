import { DataSource } from 'typeorm';
import { createSuperAdmin } from './super-admin.seed';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/entities/*.entity.js'],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await createSuperAdmin(dataSource);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed(); 
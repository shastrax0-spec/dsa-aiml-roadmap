import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from '../models/Resource.js';
import { DEFAULT_RESOURCES } from './roadmapData.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Resource.deleteMany({ user: null });
  await Resource.insertMany(DEFAULT_RESOURCES);
  console.log('✅ Seeded default resources');
  process.exit(0);
};
run();

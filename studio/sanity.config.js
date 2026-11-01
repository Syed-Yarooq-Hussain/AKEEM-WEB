import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schema.js';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('Set SANITY_STUDIO_PROJECT_ID in studio/.env.local to your Sanity project ID.');

export default defineConfig({
  name: 'akeem-welfare', title: 'Akeem Welfare',
  projectId, dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()], schema: {types: schemaTypes},
});

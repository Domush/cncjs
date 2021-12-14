#!/usr/bin/env node

import { createCommons } from 'simport';

const { __filename, __dirname, require } = createCommons(import.meta.url);

import('@babel/polyfill');

const launchServer =
  process.env.NODE_ENV === 'development'
    ? require('../output/cncjs/server-cli').default
    : require('../dist/cncjs/server-cli').default;

launchServer().catch((err) => {
  console.error('Error:', err);
});

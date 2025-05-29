#!/usr/bin/env node

import { listPublications } from './fn-list-publications.js';

// Main execution
listPublications().catch(console.error);
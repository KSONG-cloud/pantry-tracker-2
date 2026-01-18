import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // use describe/it without import
        environment: 'node', // Node.js environment for backend
        coverage: { provider: 'istanbul' },
        setupFiles: ['./tests/setup.ts'],
    },
});

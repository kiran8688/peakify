const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

test('auth.js exits when environment variables are missing', (t) => {
  const originalEnv = { ...process.env };
  const originalExit = process.exit;
  const originalError = console.error;

  let exitCode = null;
  let errorMessage = null;

  process.exit = (code) => {
    exitCode = code;
    // Throwing an error to stop execution of auth.js after "exit"
    throw new Error('process.exit called');
  };
  console.error = (msg) => {
    errorMessage = msg;
  };

  try {
    // Ensure env vars are NOT set
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;

    // Clear cache to ensure auth.js is re-executed
    const authPath = path.resolve(__dirname, 'auth.js');
    delete require.cache[authPath];

    // Execute auth.js
    try {
      require('./auth.js');
    } catch (e) {
      if (e.message !== 'process.exit called') {
        throw e;
      }
    }

    assert.strictEqual(exitCode, 1, 'process.exit should be called with 1');
    assert.strictEqual(errorMessage, "Error: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables are not set.", 'Error message should be logged');
  } finally {
    // Restore
    process.exit = originalExit;
    console.error = originalError;

    // Restore process.env properly
    for (const key in process.env) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, originalEnv);
  }
});

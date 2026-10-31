import { handleSignup } from './integrations/signup-handler.js';

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/api/signup') return handleSignup(request, env);
    return env.ASSETS.fetch(request);
  }
};

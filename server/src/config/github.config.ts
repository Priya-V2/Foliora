import { registerAs } from '@nestjs/config';

// Centralized GitHub integration configuration, mirroring the pattern in
// auth.config.ts and resume.config.ts. This is the "Connect GitHub" repo
// import feature (read-only, public repos), not an OAuth *login* provider -
// see GithubModule for why it's kept separate from AuthModule's strategies.
export default registerAs('github', () => ({
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
    // Minimum scope for reading public profile + public repo listings - no
    // `repo`/`public_repo` scope is requested, so the resulting token never
    // carries write access.
    scope: 'read:user',
  },
  tokenEncryptionKey: process.env.GITHUB_TOKEN_ENCRYPTION_KEY,
}));

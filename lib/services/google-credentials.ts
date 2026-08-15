import { readFileSync, existsSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { GoogleAuth, type JWTInput } from 'google-auth-library';

let authClient: GoogleAuth | null = null;

export function parseGoogleServiceAccountJson(raw: string): JWTInput | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed) as JWTInput;
    if (parsed.type !== 'service_account' || !parsed.client_email || !parsed.private_key) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function credentialsFilePath(): string | null {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!raw || raw.startsWith('{')) return null;
  return raw.startsWith('.') ? resolvePath(process.cwd(), raw) : raw;
}

export function getGoogleServiceAccountCredentials(): JWTInput | null {
  const fromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (fromEnv) {
    const parsed = parseGoogleServiceAccountJson(fromEnv);
    if (parsed) return parsed;
  }

  const inlineCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (inlineCreds?.startsWith('{')) {
    const parsed = parseGoogleServiceAccountJson(inlineCreds);
    if (parsed) return parsed;
  }

  const path = credentialsFilePath();
  if (path && existsSync(path)) {
    try {
      return parseGoogleServiceAccountJson(readFileSync(path, 'utf8'));
    } catch {
      return null;
    }
  }

  return null;
}

export function projectFromGoogleCredentials(): string | null {
  return getGoogleServiceAccountCredentials()?.project_id?.trim() || null;
}

export function isGoogleCredentialsConfigured(): boolean {
  return getGoogleServiceAccountCredentials() !== null;
}

export function getGoogleAuth(): GoogleAuth {
  if (!authClient) {
    const credentials = getGoogleServiceAccountCredentials();
    if (!credentials) {
      throw new Error('Google credentials not configured (set GOOGLE_SERVICE_ACCOUNT_JSON in .env)');
    }
    authClient = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
  }
  return authClient;
}

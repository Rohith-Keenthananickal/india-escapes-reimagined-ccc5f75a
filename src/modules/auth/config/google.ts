const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';

if (!googleClientId && import.meta.env.DEV) {
  console.warn(
    'VITE_GOOGLE_CLIENT_ID is missing. Add it to your .env file to enable Google sign-in.'
  );
}

export const GOOGLE_CLIENT_ID = googleClientId;

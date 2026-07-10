const SENSITIVE_KEY_PARTS = ['approved', 'contato', 'contact', 'empresa'];

export function clearAppSession() {
  if (typeof window === 'undefined') return;

  const keysToRemove = Object.keys(window.localStorage).filter((key) =>
    key === 'token' ||
    key.startsWith('appbit:') && SENSITIVE_KEY_PARTS.some((part) => key.toLowerCase().includes(part))
  );

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
}

export function hasValidSessionToken() {
  if (typeof window === 'undefined') return false;

  const token = window.localStorage.getItem('token');
  if (!token) return false;

  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return false;
    const base64Payload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, '='))) as { exp?: number };
    return typeof payload.exp !== 'number' || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

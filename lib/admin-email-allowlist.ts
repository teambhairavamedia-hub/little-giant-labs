type FirebaseEmailClaims = {
  email?: unknown;
  email_verified?: unknown;
};

export function isAuthorizedAdminClaims(
  claims: FirebaseEmailClaims,
  configuredEmails: string | undefined,
): boolean {
  if (claims.email_verified !== true || typeof claims.email !== "string") return false;

  const email = claims.email.trim().toLowerCase();
  if (!email || !configuredEmails?.trim()) return false;

  const allowedEmails = new Set(
    configuredEmails
      .split(",")
      .map((address) => address.trim().toLowerCase())
      .filter(Boolean),
  );

  return allowedEmails.has(email);
}

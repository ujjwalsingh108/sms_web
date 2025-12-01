/**
 * Client-safe validation utilities
 * These functions can be used in both client and server components
 */

/**
 * Validate subdomain format
 */
export function validateSubdomain(subdomain: string): {
  valid: boolean;
  error?: string;
} {
  // Check length
  if (subdomain.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters" };
  }

  if (subdomain.length > 63) {
    return { valid: false, error: "Subdomain must be less than 63 characters" };
  }

  // Check format (alphanumeric and hyphens only, start and end with alphanumeric)
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!subdomainRegex.test(subdomain)) {
    return {
      valid: false,
      error:
        "Subdomain can only contain lowercase letters, numbers, and hyphens. Must start and end with a letter or number.",
    };
  }

  // Check reserved subdomains
  const reserved = [
    "www",
    "api",
    "admin",
    "app",
    "mail",
    "ftp",
    "localhost",
    "staging",
    "dev",
    "test",
  ];
  if (reserved.includes(subdomain)) {
    return { valid: false, error: "This subdomain is reserved" };
  }

  return { valid: true };
}

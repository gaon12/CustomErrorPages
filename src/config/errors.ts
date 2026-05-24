export const supportedErrorCodes = new Set([
  "400",
  "401",
  "403",
  "404",
  "414",
  "500",
  "502",
  "503",
]);

export function normalizeErrorCode(errorCode: string | undefined) {
  if (!errorCode || !supportedErrorCodes.has(errorCode)) {
    return undefined;
  }

  return errorCode;
}

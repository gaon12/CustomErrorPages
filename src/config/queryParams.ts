export type PageQueryParams = {
  customMessage?: string;
  homeUrl?: string;
};

function normalizeHomeUrl(value: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(value, window.location.origin);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return undefined;
    }

    if (parsedUrl.origin === window.location.origin) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }

    return parsedUrl.href;
  } catch {
    return undefined;
  }
}

export function getPageQueryParams(
  search = window.location.search,
): PageQueryParams {
  const params = new URLSearchParams(search);
  const customMessage = params.get("message")?.trim() || undefined;
  const homeUrl = normalizeHomeUrl(params.get("homeUrl") ?? params.get("home"));

  return {
    customMessage,
    homeUrl,
  };
}

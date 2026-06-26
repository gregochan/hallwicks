import { fallbackSiteContent } from "@/lib/content/fallback";
import type { SiteContent } from "@/lib/content/types";

type StrapiResponse<T> = {
  data?: T;
};

function getStrapiBaseUrl() {
  return process.env.STRAPI_API_URL?.replace(/\/$/, "");
}

async function strapiFetch<T>(path: string, init?: RequestInit) {
  const baseUrl = getStrapiBaseUrl();

  if (!baseUrl) return null;

  const headers = new Headers(init?.headers);
  const token = process.env.STRAPI_API_TOKEN;

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}/api/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<StrapiResponse<T>>;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const response = await strapiFetch<SiteContent>(
      "hallwicks-home?populate[capabilities][populate]=*&populate[environments][populate]=*&populate[projects][populate]=*&populate[clients][populate]=*",
    );

    return response?.data ?? fallbackSiteContent;
  } catch {
    return fallbackSiteContent;
  }
}

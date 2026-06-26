import { fallbackSiteContent } from "@/lib/content/fallback";
import type { Project, SiteContent } from "@/lib/content/types";

type FeaturedWorksResponse = {
  data?: PhpFeaturedWork[];
};

type PhpFeaturedWork = {
  alt?: string | null;
  className?: string | null;
  description?: string | null;
  image?: string | null;
  layout?: string | null;
  meta?: string | null;
  title?: string | null;
};

function getApiUrl() {
  return process.env.HALLWICKS_API_URL?.trim() || "";
}

function resolveAssetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;

  const apiUrl = getApiUrl();
  if (!apiUrl) return path;

  const origin = new URL(apiUrl).origin;
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function normalizeFeaturedWork(work: PhpFeaturedWork): Project | null {
  if (!work.title || !work.meta || !work.image || !work.alt) return null;

  const layout = work.layout || "small";

  return {
    alt: work.alt,
    className: work.className || `project-card project-card-${layout}`,
    image: resolveAssetUrl(work.image),
    meta: work.meta,
    title: work.title,
  };
}

async function getFeaturedWorks() {
  const apiUrl = getApiUrl();

  if (!apiUrl) return null;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Featured works API failed: ${response.status}`);
  }

  const payload = (await response.json()) as FeaturedWorksResponse;
  const projects = payload.data
    ?.map(normalizeFeaturedWork)
    .filter((project): project is Project => Boolean(project));

  return projects?.length ? projects : null;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const projects = await getFeaturedWorks();

    return {
      ...fallbackSiteContent,
      projects: projects ?? fallbackSiteContent.projects,
    };
  } catch {
    return fallbackSiteContent;
  }
}

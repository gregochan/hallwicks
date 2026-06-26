import { fallbackSiteContent } from "@/lib/content/fallback";
import type { Project, SiteContent } from "@/lib/content/types";

type StrapiResponse<T> = {
  data?: T;
};

type StrapiImage = {
  attributes?: {
    alternativeText?: string | null;
    url?: string | null;
  };
  alternativeText?: string | null;
  url?: string | null;
};

type StrapiFeaturedWork = {
  attributes?: StrapiFeaturedWorkFields;
} & StrapiFeaturedWorkFields;

type StrapiFeaturedWorkFields = {
  alt?: string | null;
  image?: StrapiImage | { data?: StrapiImage | null } | null;
  imageUrl?: string | null;
  layout?: "large" | "tall" | "square" | "wide" | "small" | null;
  meta?: string | null;
  order?: number | null;
  title?: string | null;
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

function resolveStrapiUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;

  const baseUrl = getStrapiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
}

function getImage(work: StrapiFeaturedWorkFields) {
  const media =
    work.image && "data" in work.image
      ? work.image.data
      : work.image;
  const image = media && "attributes" in media ? media.attributes : media;

  return {
    alt: work.alt ?? image?.alternativeText ?? work.title ?? "Hallwicks featured work",
    src: resolveStrapiUrl(work.imageUrl ?? image?.url) ?? "",
  };
}

function projectClassName(layout?: StrapiFeaturedWorkFields["layout"]) {
  return `project-card project-card-${layout ?? "small"}`;
}

function normalizeFeaturedWork(item: StrapiFeaturedWork): Project | null {
  const work = item.attributes ?? item;
  const image = getImage(work);

  if (!work.title || !work.meta || !image.src) return null;

  return {
    alt: image.alt,
    className: projectClassName(work.layout),
    image: image.src,
    meta: work.meta,
    title: work.title,
  };
}

async function getFeaturedWorks() {
  const response = await strapiFetch<StrapiFeaturedWork[]>(
    "featured-works?sort[0]=order:asc&sort[1]=title:asc&populate[image]=true&pagination[pageSize]=100",
  );

  const projects = response?.data
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

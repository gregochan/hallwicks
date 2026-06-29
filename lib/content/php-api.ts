import { fallbackSiteContent } from "@/lib/content/fallback";
import type { Client, Project, SiteContent } from "@/lib/content/types";

const DEFAULT_FEATURED_WORKS_API_URL = "https://hallwicks.com/backend/api/featured-works.php";
const DEFAULT_CLIENTS_API_URL = "https://hallwicks.com/backend/api/clients.php";

type FeaturedWorksResponse = {
  data?: PhpFeaturedWork[];
};

type ClientsResponse = {
  data?: PhpClient[];
  settings?: {
    logoColumns?: number | string | null;
    logoMobileColumns?: number | string | null;
  };
};

type PhpFeaturedWork = {
  alt?: string | null;
  className?: string | null;
  description?: string | null;
  descriptionZh?: string | null;
  image?: string | null;
  images?: {
    alt?: string | null;
    image?: string | null;
  }[] | null;
  layout?: string | null;
  meta?: string | null;
  metaZh?: string | null;
  tags?: string[] | string | null;
  title?: string | null;
  titleZh?: string | null;
};

type PhpClient = {
  alt?: string | null;
  image?: string | null;
  logoSize?: string | null;
  name?: string | null;
};

function getApiUrl() {
  return process.env.HALLWICKS_API_URL?.trim() || DEFAULT_FEATURED_WORKS_API_URL;
}

function getClientsApiUrl() {
  const explicit = process.env.HALLWICKS_CLIENTS_API_URL?.trim();
  if (explicit) return explicit;

  const featuredWorksUrl = getApiUrl();
  if (featuredWorksUrl === DEFAULT_FEATURED_WORKS_API_URL) return DEFAULT_CLIENTS_API_URL;

  return featuredWorksUrl.replace(/featured-works\.php(?:\?.*)?$/, "clients.php");
}

function resolveAssetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;

  const apiUrl = getApiUrl();
  if (!apiUrl) return path;

  const origin = new URL(apiUrl).origin;
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function resolveAssetUrlFromApi(path: string, apiUrl: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (!apiUrl) return path;

  const origin = new URL(apiUrl).origin;
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function normalizeFeaturedWork(work: PhpFeaturedWork): Project | null {
  if (!work.title || !work.meta || !work.image || !work.alt) return null;

  const layout = work.layout || "small";
  const tags = Array.isArray(work.tags)
    ? work.tags
    : typeof work.tags === "string"
      ? work.tags.split(",")
      : [];
  const normalizedTags = tags
    .map((tag) => tag.trim())
    .filter(Boolean);
  const images = work.images
    ?.map((image) => {
      if (!image.image) return null;

      return {
        alt: image.alt || work.alt || work.title || "Hallwicks project image",
        image: resolveAssetUrl(image.image),
      };
    })
    .filter((image): image is { alt: string; image: string } => Boolean(image));

  return {
    alt: work.alt,
    className: work.className || `project-card project-card-${layout}`,
    description: work.description || undefined,
    descriptionZh: work.descriptionZh || undefined,
    image: resolveAssetUrl(work.image),
    images: images?.length ? images : undefined,
    meta: work.meta,
    metaZh: work.metaZh || undefined,
    tags: normalizedTags.length ? normalizedTags : undefined,
    title: work.title,
    titleZh: work.titleZh || undefined,
  };
}

function normalizeClient(client: PhpClient, apiUrl: string): Client | null {
  if (!client.name || !client.image) return null;

  return {
    alt: client.alt || `${client.name} logo`,
    image: resolveAssetUrlFromApi(client.image, apiUrl),
    logoSize: client.logoSize === "mark" ? "mark" : "wide",
    name: client.name,
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

async function getClients() {
  const apiUrl = getClientsApiUrl();

  if (!apiUrl) return null;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Clients API failed: ${response.status}`);
  }

  const payload = (await response.json()) as ClientsResponse;
  const clients = payload.data
    ?.map((client) => normalizeClient(client, apiUrl))
    .filter((client): client is Client => Boolean(client));

  if (!clients?.length) return null;

  const logoColumns = Number(payload.settings?.logoColumns || 5);
  const logoMobileColumns = Number(payload.settings?.logoMobileColumns || 2);

  return {
    clients,
    settings: {
      logoColumns: Number.isFinite(logoColumns) ? Math.max(2, Math.min(8, logoColumns)) : 5,
      logoMobileColumns: Number.isFinite(logoMobileColumns) ? Math.max(1, Math.min(4, logoMobileColumns)) : 2,
    },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const [projects, clients] = await Promise.all([
    getFeaturedWorks().catch(() => null),
    getClients().catch(() => null),
  ]);

  return {
    ...fallbackSiteContent,
    clients: clients?.clients ?? fallbackSiteContent.clients,
    projects: projects ?? fallbackSiteContent.projects,
    settings: {
      ...fallbackSiteContent.settings,
      ...clients?.settings,
    },
  };
}

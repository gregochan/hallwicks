import { fallbackSiteContent } from "@/lib/content/fallback";
import type { Client, Project, SiteContent } from "@/lib/content/types";

type FeaturedWorksResponse = {
  data?: PhpFeaturedWork[];
};

type ClientsResponse = {
  data?: PhpClient[];
};

type PhpFeaturedWork = {
  alt?: string | null;
  className?: string | null;
  description?: string | null;
  image?: string | null;
  images?: {
    alt?: string | null;
    image?: string | null;
  }[] | null;
  layout?: string | null;
  meta?: string | null;
  title?: string | null;
};

type PhpClient = {
  alt?: string | null;
  image?: string | null;
  logoSize?: string | null;
  name?: string | null;
};

function getApiUrl() {
  return process.env.HALLWICKS_API_URL?.trim() || "";
}

function getClientsApiUrl() {
  const explicit = process.env.HALLWICKS_CLIENTS_API_URL?.trim();
  if (explicit) return explicit;

  const featuredWorksUrl = getApiUrl();
  if (!featuredWorksUrl) return "";

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
    image: resolveAssetUrl(work.image),
    images: images?.length ? images : undefined,
    meta: work.meta,
    title: work.title,
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

  return clients?.length ? clients : null;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [projects, clients] = await Promise.all([getFeaturedWorks(), getClients()]);

    return {
      ...fallbackSiteContent,
      clients: clients ?? fallbackSiteContent.clients,
      projects: projects ?? fallbackSiteContent.projects,
    };
  } catch {
    return fallbackSiteContent;
  }
}

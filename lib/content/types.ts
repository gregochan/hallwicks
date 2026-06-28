export type Capability = {
  number: string;
  icon: string;
  title: string;
  copy: string;
};

export type Environment = {
  icon: string;
  title: string;
  copy: string;
};

export type Project = {
  title: string;
  meta: string;
  image: string;
  alt: string;
  className: string;
  description?: string;
  images?: {
    alt: string;
    image: string;
  }[];
};

export type SiteContent = {
  capabilities: Capability[];
  environments: Environment[];
  clients: string[];
  projects: Project[];
};

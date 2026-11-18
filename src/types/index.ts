import type { CollectionEntry } from 'astro:content';

export interface PostImage {
  url: string;
  alt?: string;
}

export interface PostFrontmatter {
  title: string;
  description?: string;
  date: Date;
  tags?: string[];
  image?: PostImage;
  author?: string;
  updated?: Date;
  url?: string;
  pinned?: boolean;
  draft?: boolean;
}

export interface PostData {
  id: string;
  url: string;
  title: string;
  date: string | Date;
  tags: string[];
  description?: string;
  excerptHtml: string;
  pinned?: boolean;
}

export type PostEntry = CollectionEntry<'posts'>;

export interface StructuredData {
  '@context'?: string;
  '@type'?: string;
  [key: string]: unknown;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon?: string;
}

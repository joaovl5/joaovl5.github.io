import { siteConfig } from '@/config/site.config';

export function buildUrl(path: string | string[]): string {
  const relativePath = Array.isArray(path) ? path.join('/') : path;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(relativePath)) return relativePath;
  const base = `/${siteConfig.base || ''}`
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
  const [, pathname = '', suffix = ''] =
    relativePath.match(/^([^?#]*)(.*)$/) || [];
  const parts = pathname.split('/').filter((part) => part && part !== '.');
  const trailingSlash = pathname.endsWith('/') || !parts.length;
  const cleanPath = parts.join('/');
  return `${base}/${cleanPath}${trailingSlash && cleanPath ? '/' : ''}${suffix}`;
}

export function extractExcerptFromHtml(
  html: string,
  maxLength: number = 300,
): string {
  const moreMarker = /<!--\s*more\s*-->/i;
  if (moreMarker.test(html)) {
    const [excerptHtml] = html.split(moreMarker);
    return excerptHtml.trim();
  }
  const firstParagraphMatch = html.match(/<(p|ul|ol)\b[^>]*>[\s\S]*?<\/\1>/i);
  if (firstParagraphMatch) {
    return firstParagraphMatch[0];
  }
  const text = html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function extractExcerptFromMarkdown(
  markdown: string,
  maxLength: number = 300,
): string {
  const source = markdown
    .split(/<!--\s*more\s*-->/i)[0]
    .replace(/^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)\s*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const paragraph =
    source
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !/^(---|#|```|>|!\[)/.test(block)) || '';

  const text = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~|]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200,
): number {
  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
    throw new RangeError('Reading speed must be positive');
  }
  return Math.ceil(countWords(content) / wordsPerMinute);
}

export function countWords(content: string): number {
  const strippedContent = content.replace(/<[^>]+>/g, '').trim();

  const chineseCharCount = (strippedContent.match(/[\u4e00-\u9fa5]/g) || [])
    .length;
  const englishWordCount = (strippedContent.match(/[a-zA-Z]+/g) || []).length;
  return chineseCharCount + englishWordCount;
}

function ordinalSuffix(day: number): string {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDate(
  date: Date | string,
  format: 'iso' | 'local' | 'month-day' = 'iso',
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }

  // Content dates are authored as calendar dates, so read them in UTC to keep
  // the day from shifting in negative-offset timezones.
  const month = d.toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  const day = `${d.getUTCDate()}${ordinalSuffix(d.getUTCDate())}`;

  return format === 'month-day'
    ? `${month} ${day}`
    : `${month} ${day}, ${d.getUTCFullYear()}`;
}

export function getPostUrl(
  postId: string,
  basePath: string = '/posts',
): string {
  return buildUrl([
    basePath,
    postId.split('/').map(encodeURIComponent).join('/'),
    '',
  ]);
}

export function getTagRoutePath(tag: string): string {
  const normalized = tag.normalize();
  const hasControlCharacter = Array.from(normalized).some(
    (char) => char.charCodeAt(0) < 0x20 || char.charCodeAt(0) === 0x7f,
  );
  if (
    /[%/?#\\]/.test(normalized) ||
    hasControlCharacter ||
    /^\.{1,2}$/.test(normalized) ||
    normalized.startsWith('~')
  ) {
    return `~${Array.from(new TextEncoder().encode(normalized), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  }
  return normalized;
}

export function getTagUrl(tag: string, basePath: string = '/tags'): string {
  return buildUrl([basePath, encodeURIComponent(getTagRoutePath(tag)), '']);
}

export function sanitizeViewTransitionName(id: string): string {
  return `post-${Array.from(String(id), (char) => char.codePointAt(0)?.toString(16)).join('-')}`;
}

export function isPostPage(
  pathname: string,
  postPath: string = '/posts',
): boolean {
  const prefix = buildUrl(postPath).replace(/\/$/, '');
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isHomePage(pathname: string): boolean {
  const home = buildUrl('');
  return (
    pathname === home ||
    pathname === home.replace(/\/$/, '') ||
    pathname === `${home}index.html`
  );
}

export function generateBreadcrumbItems(
  postId: string,
  _isCategory: boolean = false,
): Array<{ label: string; href: string }> {
  // Posts live under /posts/, which is their own root: the trail starts there
  // instead of at the site root so the hierarchy matches the URL.
  const items: Array<{ label: string; href: string }> = [
    { label: 'Posts', href: buildUrl(['posts', '']) },
  ];

  const pathParts = postId.split('/').filter(Boolean);

  let currentPath = '';
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    currentPath += `${currentPath ? '/' : ''}${part}`;
    items.push({
      label: part.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      href: getPostUrl(currentPath),
    });
  }

  return items;
}

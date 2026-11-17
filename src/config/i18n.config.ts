export interface I18nConfig {
  common: {
    brand: string;
    menu: {
      toggle: string;
    };
    search: {
      placeholder: string;
      loadError: string;
      noResults: string;
      resultCount: string;
      loading: string;
      region: string;
      ariaLabel: {
        open: string;
        close: string;
        input: string;
        viewArticle: string;
      };
    };
    posts: {
      readingTime: string;
      noResults: string;
      count: string;
      pinned: string;
    };
    tags: {
      count: string;
    };
    timeline: {
      count: string;
    };
    category: {
      count: string;
    };
    breadcrumb: {
      loadError: string;
      loading: string;
      empty: string;
      label: string;
      children: string;
    };
    backToTop: string;
    readingProgress: string;
    theme: {
      light: string;
      dark: string;
      label: string;
    };
    toc: {
      label: string;
      quickLabel: string;
      currentSection: string;
      quickNavLabel: string;
    };
  };
  header: {
    nav: {
      home: string;
      timeline: string;
      about: string;
    };
  };
  footer: {
    copyright: string;
    poweredBy: string;
  };
  sidebar: {
    stats: {
      posts: string;
      tags: string;
      updated: string;
    };
  };
  social: {
    github: string;
    email: string;
    rss: string;
    sitemap: string;
  };
}

export const i18nConfig = {
  'en-US': {
    common: {
      brand: 'Pudding',
      search: {
        placeholder: 'Search articles...',
        loadError: 'Search data could not be loaded. Please try again later.',
        noResults: 'No matching articles found',
        resultCount: '{count} posts found',
        loading: 'Loading full-text index...',
        region: 'Article search',
        ariaLabel: {
          open: 'Open search box',
          close: 'Close search box',
          input: 'Enter keywords to search articles',
          viewArticle: 'View article: {title}',
        },
      },
      menu: {
        toggle: 'Toggle menu',
      },
      posts: {
        readingTime: 'min read',
        noResults: 'No matching articles found',
        count: 'posts',
        pinned: 'Pinned',
      },
      tags: {
        count: 'posts',
      },
      timeline: {
        count: 'posts',
      },
      category: {
        count: 'posts',
      },
      breadcrumb: {
        loadError: 'Could not load items',
        loading: 'Loading...',
        empty: 'No items',
        label: 'Breadcrumb',
        children: 'View items under {label}',
      },
      backToTop: 'Back to top',
      readingProgress: 'Reading progress',
      theme: {
        light: 'light',
        dark: 'dark',
        label: '{current} theme active. Switch to {target} theme',
      },
      toc: {
        label: 'Table of contents',
        quickLabel: 'Quick contents',
        currentSection: 'Current section: {title}',
        quickNavLabel: 'Go to section: {title}',
      },
    },
    header: {
      nav: {
        home: 'Home',
        timeline: 'Timeline',
        about: 'About',
      },
    },
    footer: {
      copyright: '© {year} {author}. All rights reserved.',
      poweredBy: 'Powered by',
    },
    sidebar: {
      stats: {
        posts: 'posts',
        tags: 'tags',
        updated: 'updated',
      },
    },
    social: {
      github: 'GitHub',
      email: 'Email',
      rss: 'RSS',
      sitemap: 'Sitemap',
    },
  },
} satisfies Record<string, I18nConfig>;

export type SupportedLocale = keyof typeof i18nConfig;

export const defaultLocale: SupportedLocale = 'en-US';

export function getLocale(locale?: string): SupportedLocale {
  if (locale && Object.hasOwn(i18nConfig, locale)) {
    return locale as SupportedLocale;
  }
  return defaultLocale;
}

export function t(
  locale: SupportedLocale,
  path: string,
  params?: Record<string, string | number>,
): string {
  const config = i18nConfig[getLocale(locale)];
  const keys = path.split('.');
  let value: unknown = config;

  for (const key of keys) {
    if (
      typeof value !== 'object' ||
      value === null ||
      !Object.hasOwn(value, key)
    ) {
      console.warn(
        `i18n: Missing translation for "${path}" in locale "${locale}"`,
      );
      return path;
    }
    value = (value as Record<string, unknown>)[key];
  }

  if (typeof value !== 'string') return path;
  if (!params) return value;
  return value.replace(
    /\{(\w+)\}/g,
    (_, key: string) => params[key]?.toString() ?? `{${key}}`,
  );
}

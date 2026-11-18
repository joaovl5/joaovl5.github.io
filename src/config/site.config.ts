export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  base: string;
  site: string;
  keywords: Array<string>;
  author: {
    name: string;
    slugId: string;
    email?: string;
    github?: string;
    avatar?: string;
  };
  navItems: Array<{
    href: string;
    labelKey: string;
    label: string;
  }>;
  socialLinks: Array<{
    nameKey: string;
    href: string;
    icon?: string;
  }>;
  theme: {
    light: {
      primary: string;
      secondary?: string;
    };
    dark: {
      primary: string;
      secondary?: string;
    };
  };
  locale: string;
}

export const siteConfig: SiteConfig = {
  name: "João Pedro",
  description: "Personal page with my portfolio and articles.",
  url: "https://joaovl5.github.io",
  site: "https://joaovl5.github.io",
  base: "/",
  keywords: ["astro", "blog", "portfolio", "pudding"],
  author: {
    name: "João Pedro",
    slugId: "joaovl5",
    email: "vieiraleao2005@gmail.com",
    github: "https://github.com/joaovl5",
  },
  navItems: [
    { href: "./", labelKey: "home", label: "home" },
    { href: "./posts/", labelKey: "posts", label: "posts" },
    { href: "./timeline/", labelKey: "timeline", label: "timeline" },
    { href: "./about/", labelKey: "about", label: "about" },
  ],
  socialLinks: [
    { nameKey: "social.github", href: "https://github.com/joaovl5" },
    { nameKey: "social.email", href: "mailto:vieiraleao2005@gmail.com" },
    { nameKey: "social.rss", href: "./rss.xml" },
    { nameKey: "social.sitemap", href: "./sitemap.xml" },
  ],
  theme: {
    light: {
      primary: "#5e7eff",
    },
    dark: {
      primary: "#ff9eb6",
    },
  },
  locale: "en-US",
};

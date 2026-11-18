<script lang="ts">
import { onMount } from 'svelte';
import Moon from '@lucide/svelte/icons/moon';
import Sun from '@lucide/svelte/icons/sun';
import { t } from '@/utils/i18n';

type Theme = 'light' | 'dark';
let theme: Theme = 'light';
let transitionSequence = 0;
let activeTransition: ViewTransition | null = null;

function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

function initialTheme(): Theme {
  return (
    savedTheme() ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
  );
}

function executeThemeChange(newTheme: Theme) {
  theme = newTheme;
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(newTheme);
  html.setAttribute('data-theme', newTheme);
}

function applyTheme(newTheme: Theme, event?: MouseEvent) {
  const sequence = ++transitionSequence;
  activeTransition?.skipTransition();
  const html = document.documentElement;
  html.classList.remove('theme-transitioning');
  if (
    !document.startViewTransition ||
    !event ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    activeTransition = null;
    executeThemeChange(newTheme);
    return;
  }
  html.classList.add('theme-transitioning');
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
  const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  try {
    const transition = document.startViewTransition(() => {
      if (sequence === transitionSequence) executeThemeChange(newTheme);
    });
    activeTransition = transition;
    void transition.ready
      .then(() => {
        if (sequence !== transitionSequence) return;
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ];
        html.animate(
          {
            clipPath: newTheme === 'dark' ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement:
              newTheme === 'dark'
                ? '::view-transition-old(root)'
                : '::view-transition-new(root)',
            fill: 'both',
          },
        );
      })
      .catch(() => {
        /* A skipped transition still applies the theme. */
      });
    void transition.finished
      .catch(() => {})
      .finally(() => {
        if (sequence === transitionSequence) {
          html.classList.remove('theme-transitioning');
          activeTransition = null;
        }
      });
  } catch {
    html.classList.remove('theme-transitioning');
    executeThemeChange(newTheme);
  }
}

onMount(() => {
  const current = document.documentElement.getAttribute('data-theme');
  executeThemeChange(
    current === 'dark' || current === 'light' ? current : initialTheme(),
  );
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light');
  };
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'theme' || event.key === null) applyTheme(initialTheme());
  };
  mediaQuery.addEventListener('change', handleSystemThemeChange);
  window.addEventListener('storage', handleStorageChange);
  return () => {
    ++transitionSequence;
    activeTransition?.skipTransition();
    document.documentElement.classList.remove('theme-transitioning');
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
    window.removeEventListener('storage', handleStorageChange);
  };
});

function toggleTheme(event: MouseEvent) {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  theme = newTheme;
  try {
    localStorage.setItem('theme', newTheme);
  } catch {
    /* Theme switching works without storage. */
  }
  applyTheme(newTheme, event);
}
</script>

<button
  type="button"
  class="theme-toggle-container"
  on:click={toggleTheme}
  aria-label={t('common.theme.label', { current: t(`common.theme.${theme}`), target: t(`common.theme.${theme === 'dark' ? 'light' : 'dark'}`) })}
  aria-pressed={theme === "dark"}
>
  <span class="theme-options">
    <span class="nav-link light theme-option" aria-hidden="true">
      <Sun size={18} strokeWidth={2} />
    </span>

    <span class="nav-link dark theme-option" aria-hidden="true">
      <Moon size={18} strokeWidth={2} />
    </span>
    <span class="indicator theme-toggle-indicator" aria-hidden="true"></span>
  </span>
</button>

<style>
  .theme-toggle-container {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    position: relative;
  }

  .theme-options {
    display: inline-flex;
    align-items: center;
    gap: 0;
    position: relative;
  }

  /* Equal-width icon slots keep the sliding indicator aligned to each half. */
  .theme-option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    padding: 0.25rem 0;
  }

  .indicator.theme-toggle-indicator {
    left: 0;
    position: absolute;
    bottom: -3px;
    width: 50%;
    height: 3px;
    border-radius: 3px;
    background: var(--primary-color);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    view-transition-name: theme-indicator;
  }


  .theme-toggle-container:focus-visible {
    outline: 2px solid var(--theme-color);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* View Transitions for Theme Toggle */
  :global(.theme-transitioning),
  :global(.theme-transitioning *) {
    transition: none !important;
  }

  /* During the theme view transition the indicator is painted by its own
     pseudo-elements, so the live element snaps to the destination and the
     group below carries the slide — starting on click, not after the circle. */
  :global(::view-transition-group(theme-indicator)) {
    animation-duration: 150ms;
    animation-timing-function: ease-out;
  }

  :global(::view-transition-image-pair(theme-indicator)) {
    mix-blend-mode: normal;
  }

  :global(::view-transition-old(theme-indicator)),
  :global(::view-transition-new(theme-indicator)) {
    animation: none;
  }
  :global(.theme-transitioning::view-transition-group(root)),
  :global(.theme-transitioning::view-transition-image-pair(root)),
  :global(.theme-transitioning::view-transition-old(root)),
  :global(.theme-transitioning::view-transition-new(root)) {
    animation: none !important;
    mix-blend-mode: normal !important;
  }

  :global(.theme-transitioning::view-transition-old(root)),
  :global(.theme-transitioning::view-transition-new(root)) {
    opacity: 1 !important;
    display: block !important;
  }
  :global(.theme-transitioning::view-transition-old(root)) {
    z-index: 1;
  }
  :global(.theme-transitioning::view-transition-new(root)) {
    z-index: 9999;
  }
  :global(.theme-transitioning[data-theme="dark"]::view-transition-old(root)) {
    z-index: 9999;
  }
  :global(.theme-transitioning[data-theme="dark"]::view-transition-new(root)) {
    z-index: 1;
  }
</style>

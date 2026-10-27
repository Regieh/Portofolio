// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import appsCover from './assets/project/cococo/hero.png';
import gamesCover from './assets/project/famine/hero.png';
import webCover from './assets/project/ajm-creation/hero-mobile.png';

// Lucide icon used for the logo mark and the 3D hero object (lucide.dev/icons).
// If you change it, also update src/assets/icon.svg (the favicon source).
export { Box as SiteIcon } from '@lucide/astro';

export const SITE_TITLE = 'Raphael Gregorius';
export const SITE_DESCRIPTION = 'Building software, writing code, and sharing knowledges.';

export const EMAIL = 'raphaelghakim@gmail.com';
export const GITHUB_URL = 'https://github.com/Regieh';
export const INSTAGRAM_URL = 'https://www.instagram.com/raphaelgregorius/';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/raphaelgregorius/';

export const CATEGORIES = [
	{ slug: 'apps', key: 'app', label: 'Apps', blurb: 'iOS and mobile apps', cover: appsCover },
	{ slug: 'games', key: 'game', label: 'Games', blurb: 'Games built in Unity', cover: gamesCover },
	{ slug: 'web', key: 'web', label: 'Websites', blurb: 'Websites and web apps', cover: webCover },
] as const;

// TODO: Kinda feeling like each controller should define the defaults,
// and build a defaultConfig from that...
// I feel like this object will be difficult to maintain as we add more features/tools
const defaultConfig = {
  fontFamily: {
    options: {
      default: { label: 'Page Default', css: '' },
      sans: { label: "Sans Serif", css:  "Helvetica Neue, Helvetica, Arial, sans-serif" },
      serif: { label: "Serif", css: 'Georgia, serif' },
      openDyslexic: { label: "OpenDyslexic", css: '"Open-Dyslexic", sans-serif', load: 'https://fonts.cdnfonts.com/css/open-dyslexic' }
    }
  },
  fontSize: { default: 100, min: 100, max: 500, step: 25 },
  letterSpacing: { default: 0, min: 0, max: 5, step: 1 },
  ui: {
    title: "Personalization Options",
    description: "Personalize your web experience with these tools.",
    buttonIcon: '⚙️ ',
    width: "400px",
    theme: {
      font: {
        family: "Helvetica Neue, Helvetica, Arial, sans-serif",
        size: "1rem",
      },
      colors: {
        primary: "#015479",
        secondary: "#0177AC",
        background: "#fafafa",
        bodyFont: "#000000",
        primaryFont: "#000000",
        secondaryFont: "#FFFFFF",
        link: "#015479",
      }
    }
  },
  show: [
    'change_font_family',   // displays each controller in this order
    'change_font_size',     // names match files in src/controllers/ and src/ui/
    'change_letter_spacing' // e.g. src/controllers/change_font_size_controller.js and src/ui/change_font_size.html
  ]
};


async function fetchUserConfig() {
  try {
    const el = document.querySelector("[data-db-personalization-widget-config-url]")

    if(el) {
      const configUrl = el.dataset.dbPersonalizationWidgetConfigUrl;
      const response = await fetch(configUrl, { cache: 'no-store' });
      if(response.ok) {
        const userConfig = await response.json();
        return userConfig;
      }
    }
    return {};
  } catch (e) {
    console.warn('Invalid DubBot personalization config');
    return {};
  }
}

function deepMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// this is the cached config so we only fetch it once
let cachedConfig = null;
export async function getConfig() {
  // return the cached config when it's available
  if(cachedConfig) { return cachedConfig }

  cachedConfig = deepMerge(defaultConfig, await fetchUserConfig());
  return cachedConfig;
}

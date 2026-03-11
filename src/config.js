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
  cursorSize: {
    options: {
      default: { label: 'Default', css: '', class: '' },
      large: { label: 'Large', css: '', class: 'db-cursor-large' },
      extraLarge: { label: 'Extra Large', css: '', class: 'db-cursor-extra-large' }
    }
  },
  colorContrast: {
    options: {
      default: { label: 'Default', css: '', class: '' },
      high: { label: 'High Contrast', css: 'contrast(1.5)', class: 'db-high-contrast' },
      inverted: { label: 'Inverted Colors', css: '', class: 'db-inverted' },
      darkMode: { label: 'Dark Mode', css: '', class: 'db-dark-mode' },
      darkHighContrast: { label: 'Dark High Contrast', css: 'contrast(1.3)', class: 'db-dark-mode' },
      sepia: { label: 'Sepia', css: 'sepia(0.8)', class: '' },
      grayscale: { label: 'Grayscale', css: 'grayscale(1)', class: '' }
    }
  },
  readingGuide: {
    opacity: 0.6, // Default opacity for the dimmed area (0.0 = transparent, 1.0 = fully opaque)
    height: 60, // Default height of the reading guide strip in pixels
    options: {
      off: { label: 'Off' },
      on: { label: 'On' }
    }
  },
  ui: {
    title: "Personalization Options",
    description: "Personalize your web experience with these tools.",
    position: "right",
    buttonIcon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d=\"M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm161.5-86.1c-12.2-5.2-26.3 .4-31.5 12.6s.4 26.3 12.6 31.5l11.9 5.1c17.3 7.4 35.2 12.9 53.6 16.3l0 50.1c0 4.3-.7 8.6-2.1 12.6l-28.7 86.1c-4.2 12.6 2.6 26.2 15.2 30.4s26.2-2.6 30.4-15.2l24.4-73.2c1.3-3.8 4.8-6.4 8.8-6.4s7.6 2.6 8.8 6.4l24.4 73.2c4.2 12.6 17.8 19.4 30.4 15.2S339 397 334.8 384.4l-28.7-86.1c-1.4-4.1-2.1-8.3-2.1-12.6l0-50.1c18.4-3.5 36.3-8.9 53.6-16.3l11.9-5.1c12.2-5.2 17.8-19.3 12.6-31.5s-19.3-17.8-31.5-12.6L338.7 175c-26.1 11.2-54.2 17-82.7 17s-56.5-5.8-82.7-17l-11.9-5.1zM256 160a40 40 0 1 0 0-80 40 40 0 1 0 0 80z\" fill=\"#FFFFFF\"/></svg>",
    width: "400px",
    theme: {
      font: {
        family: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      },
      colors: {
        primary: "#015479",
        background: "#fafafa",
        font: "#1D182A"
      }
    }
  },
  show: [
    'change_font_family',    // displays each controller in this order
    'change_font_size',      // names match files in src/controllers/ and src/ui/
    'change_letter_spacing', // e.g. src/controllers/change_font_size_controller.js and src/ui/change_font_size.html
    'change_cursor_size',    // cursor size options
    'change_color_contrast', // color contrast and theme options
    'reading_guide'          // reading guide toggle
  ]
};

const getDatasetOverrides = (dataset) => {
  const overrides = {};

  if (!dataset || typeof dataset !== 'object') {
    return overrides;
  }

  Object.entries(dataset).forEach(([key, value]) => {
    if (value == null || value === '') {
      return;
    }

    const path = key
      .split(/(?=[A-Z])/) // Split camelCase into parts (uiThemeColorsPrimary -> ['ui', 'theme', 'colors', 'primary'])
      .map((part) => part.charAt(0).toLowerCase() + part.slice(1));

    let current = overrides;
    path.forEach((segment, index) => {
      if (index === path.length - 1) {
        current[segment] = value;
        return;
      }

      current[segment] = current[segment] || {};
      current = current[segment];
    });
  });

  return overrides
}

function getHostOverrides() {
  const host = document.getElementById('dubbot-personalization-widget');

  if (!host) {
    return {};
  }

  const overrides = {};
  const hostDatasetOverrides = {
    uiPosition: host.dataset.position,
    uiThemeColorsPrimary: host.dataset.colorPrimary,
    uiThemeColorsBackground: host.dataset.colorBackground,
    uiThemeColorsFont: host.dataset.colorFont
  };

  deepMerge(overrides, getDatasetOverrides(hostDatasetOverrides));

  return overrides;
}


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
export async function getConfig(scriptDataset = {}) {
  // return the cached config when it's available
  if(cachedConfig) { return cachedConfig }

  cachedConfig = deepMerge(defaultConfig, await fetchUserConfig());
  cachedConfig = deepMerge(cachedConfig, getHostOverrides());

  const htmlOverrides = getDatasetOverrides(scriptDataset);
  cachedConfig = deepMerge(cachedConfig, htmlOverrides);

  return cachedConfig;
}

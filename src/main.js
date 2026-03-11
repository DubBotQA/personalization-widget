import html from './widget.html?raw';
import widgetCSS from './widget-postcss.css?raw';
import pageOverridesCSS from './page-overrides.css?raw';
import bootstrapCSS from 'bootstrap/dist/css/bootstrap.min.css?raw';
import { Application } from '@hotwired/stimulus';

const COLOR_PRESETS = {
  StandardBlue: '#0000FF',
  PurplePop: '#B852EE',
  BrickRed: '#9C0E1D',
  TrueBlack: '#000000',
  ForestGreen: '#0E6328',
  VioletPurple: '#0E6328'
};

const SCRIPT_ATTRIBUTE_PARSERS = {
  dbPersonalizationWidgetConfigUrl: (value) => value,
  colorPrimary: resolveColorValue,
  colorBackground: resolveColorValue,
  colorFont: resolveColorValue,
  position: normalizePosition
};

function injectWidget() {
  // Inject page overrides for personalization features
  const pageStyle = document.createElement('style');
  pageStyle.id = 'dubbot-page-overrides';
  pageStyle.textContent = pageOverridesCSS;
  document.head.appendChild(pageStyle);

  // Create host and attach shadow root
  const host = document.createElement('div');
  host.id = 'dubbot-personalization-widget';
  const shadow = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  // Inject Bootstrap CSS
  const bootstrap = document.createElement('style');
  bootstrap.textContent = bootstrapCSS;
  shadow.appendChild(bootstrap)
  copyBootstrapVarsToHost(shadow);

  // Inject widget CSS
  const style = document.createElement('style');
  style.textContent = widgetCSS;
  shadow.appendChild(style);

  // Inject widget HTML
  const container = document.createElement('div');
  container.id = 'db-widget-root';
  container.innerHTML = html;
  shadow.appendChild(container);


  const widgetRoot = shadow.getElementById('db-widget-root');

  // set config from attributes
  const scriptAttributes = getScriptAttributes();
  Object.entries(scriptAttributes).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    host.setAttribute(`data-${camelToKebab(key)}`, value);
  });

  // Start Stimulus
  const app = Application.start(widgetRoot);

  // Dynamically import and register all controllers
  const controllerModules = import.meta.glob('./controllers/*_controller.js', { eager: true });
  for (const path in controllerModules) {
    const module = controllerModules[path];
    const controller = module.default;

    const match = path.match(/\.\/controllers\/(.*)_controller\.js$/);
    if (!match) continue;

    const identifier = match[1].replace(/_/g, '-'); // e.g. change_font_size -> change-font-size
    app.register(identifier, controller);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectWidget);
} else {
  injectWidget();
}

// Bootstrap dumps their variables in :root,
// but the shadow DOM does not have :root.
// It has :host. This function copies those
// :root styles to :host
function copyBootstrapVarsToHost(shadowRoot) {
  const styleSheets = shadowRoot.styleSheets;

  for (const sheet of styleSheets) {
    try {
      const rules = sheet.cssRules || [];

      for (const rule of rules) {
        if (rule.selectorText.startsWith(':root')) {
          const style = document.createElement('style');
          style.textContent = rule.cssText.replace(':root', ':host');
          shadowRoot.appendChild(style);
          return;
        }
      }
    } catch (err) {
      console.warn('[DubBot Personalization Widget] Could not access stylesheet:', err);
    }
  }
}

function getScriptAttributes() {
  const script = getWidgetScriptElement();

  if (!script) {
    return {};
  }

  return Object.entries(SCRIPT_ATTRIBUTE_PARSERS).reduce((attributes, [key, parser]) => {
    const value = parser(script.dataset[key]);
    if (value) {
      attributes[key] = value;
    }
    return attributes;
  }, {});
}

function getWidgetScriptElement() {
  if (document.currentScript) {
    return document.currentScript;
  }

  // Fallback for Vite Dev Mode (uses Modules, which doesn't include currentScript.dataset)
  const scripts = document.getElementsByTagName('script');
  return Array.from(scripts).find((s) =>
    s.src.includes('personalization-widget') || s.src.includes('main.js')
  );
}

function normalizePosition(value) {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  return normalized === 'left' || normalized === 'right' ? normalized : null;
}

function resolveColorValue(value) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  const lowerCased = normalized.toLowerCase();

  if (normalized.startsWith('#') || lowerCased.startsWith('rgb')) {
    return normalized;
  }

  return COLOR_PRESETS[normalized] || normalized;
}

function camelToKebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

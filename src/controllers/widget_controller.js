import { Controller } from '@hotwired/stimulus';
import Preferences from '../preferences.js';
import { getConfig } from '../config.js';
import { hexToRgb } from '../helpers/hex_to_rgb.js';

export default class extends Controller {
  static targets = ['button', 'card', 'title', 'description', 'controllers'];

  async connect() {
    this.config = await getConfig();

    // we can't async the stimulus init function
    // and we need the configuration for the UI init
    // and only want the UI to initialize once
    if (!this.initialized) {
      this.initUI();
    }

    this.activateOverrides();
  }

  initUI() {
    this.buttonTarget.innerHTML = this.config.ui.buttonIcon;

    this.cardTarget.style.width = this.config.ui.width;
    this.titleTarget.innerText = this.config.ui.title;
    this.descriptionTarget.innerText = this.config.ui.description;

    this.initTheme();
    this.initControllerUIs();
    this.initialized = true
  }

  initTheme() {
    const style = document.createElement('style');
    const theme = this.config.ui.theme;
    const cssVars = [];

    // set color CSS variables
    const colors = theme.colors || {};
    for (const [key, value] of Object.entries(colors)) {
      const dbKey = `--db-colors-${key}`;
      const bsKey = `--bs-${key}`;
      const rgb = hexToRgb(value);
      cssVars.push(`${dbKey}: ${value}`);
      cssVars.push(`${dbKey}-rgb: ${rgb}`);
      cssVars.push(`${bsKey}: var(${dbKey})`);
      cssVars.push(`${bsKey}-rgb: var(${dbKey}-rgb)`);
    }
    cssVars.push(`--db-widget-width: ${this.config.ui.width}`);
    cssVars.push(`--db-font-family: ${theme.font.family}`);

    style.textContent = `:host { ${cssVars.join(';\n')}; }`;
    this.element.appendChild(style);
  }

  initControllerUIs() {
    const fragmentModules = import.meta.glob('../ui/*.html', { query: '?raw', import: 'default', eager: true });
    this.config.show.forEach((controller) => {
      const path = `../ui/${controller}.html`;
      const html = fragmentModules[path];

      if (!html) { return } // if there's no HTML, then move on

      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      this.controllersTarget.appendChild(wrapper.firstElementChild);
    });
  }

  activateOverrides() {
    const root = document.body;
    if (!root.classList.contains('dubbot-site-root')) {
      root.classList.add('dubbot-site-root');
    }
  }

  toggle() {
    const isOpen = this.cardTarget.classList.toggle('show');
    this.cardTarget.setAttribute('aria-hidden', !isOpen);
    this.buttonTarget.setAttribute('aria-expanded', isOpen);
  }

  reset() {
    // remove our junk from the main doc
    const root = document.body;
    root.classList.remove('dubbot-site-root');

    // remove font family class
    root.classList.remove('db-font-family-override');

    // remove font size class
    root.classList.remove('db-font-size-override');

    // remove all contrast classes
    const contrastClasses = [
      'db-dark-mode',
      'db-high-contrast',
      'db-inverted'
    ];
    contrastClasses.forEach(cls => {
      root.classList.remove(cls);
    });

    // remove all cursor classes
    const cursorClasses = [
      'db-cursor-large',
      'db-cursor-extra-large'
    ];
    cursorClasses.forEach(cls => {
      root.classList.remove(cls);
    });

    // remove reading guide
    root.classList.remove('db-reading-guide-enabled');
    const readingGuideContainer = document.getElementById('db-reading-guide-container');
    if (readingGuideContainer)
      readingGuideContainer.remove();

    // clear inline styles that might have been applied
    root.style.filter = '';
    root.style.cursor = '';

    // clear all preferences
    Preferences.reset();

    // reconnect all controllers
    const controllers = this.application.controllers;
    controllers.forEach((controller) => {
      if (controller.disconnect && controller.connect) {
        controller.disconnect();
        controller.connect();
      }
    });
  }
}

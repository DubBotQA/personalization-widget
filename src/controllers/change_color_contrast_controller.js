import { Controller } from '@hotwired/stimulus';
import { getConfig } from '../config.js';
import Preferences from '../preferences.js';

const PREF_KEY = 'db-color-contrast';
const DEFAULT_VALUE = 'default';

export default class extends Controller {
  static targets = ['select'];

  async connect() {
    this.config = await getConfig();

    this.options = this.config.colorContrast.options;
    this.populateOptions();

    const value = Preferences.get(PREF_KEY) || DEFAULT_VALUE;
    this.selectTarget.value = value;
    this.change();
  }

  populateOptions() {
    this.selectTarget.innerHTML = '';

    for(const [key, value] of Object.entries(this.options)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = value.label;
      this.selectTarget.appendChild(option);
    }
  }

  change() {
    const value = this.selectTarget.value;
    const contrastOptions = this.options[value];

    // Remove any existing contrast classes and filters
    this.removeAllContrastClasses();
    this.removeAllFilters();

    // Apply contrast filter to body children (excluding widget) for global filters
    if (contrastOptions.css) {
      this.applyFilterToContent(contrastOptions.css);
    }

    // Apply contrast class if specified
    if (contrastOptions.class) {
      document.body.classList.add(contrastOptions.class);
    }

    Preferences.set(PREF_KEY, value);
    this.selectTarget.value = value;
  }

  applyFilterToContent(filterCss) {
    // Apply filter to all body children except the widget
    const bodyChildren = document.body.children;
    for (let child of bodyChildren) {
      if (child.id !== 'dubbot-personalization-widget') {
        child.style.filter = filterCss;
      }
    }
  }

  removeAllFilters() {
    // Remove filters from all body children
    const bodyChildren = document.body.children;
    for (let child of bodyChildren) {
      child.style.filter = '';
    }
    // Also remove from body itself (legacy)
    document.body.style.filter = '';
  }

  removeAllContrastClasses() {
    // Remove all known contrast classes
    const contrastClasses = [
      'db-dark-mode',
      'db-high-contrast',
      'db-inverted'
    ];
    contrastClasses.forEach(cls => {
      document.body.classList.remove(cls);
    });
  }
}

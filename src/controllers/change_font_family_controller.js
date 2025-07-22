import { Controller } from '@hotwired/stimulus';
import WidgetController from './widget_controller.js';
import { getConfig } from '../config.js';
import Preferences from '../preferences.js';

const PREF_KEY = '--db-font-family';
const CLASS_NAME = 'db-font-family-override';
const DEFAULT_VALUE = 'default';

export default class extends Controller {
  static targets = ['select'];

  async connect() {
    this.config = await getConfig();

    this.options = this.config.fontFamily.options;
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
    const fontOptions = this.options[value];

    if(fontOptions.load !== undefined) {
      this.loadFont(value);
    }

    // If "Page Default" is selected (empty css), remove the class entirely
    // This allows original page styling (including inline styles) to show through
    if (fontOptions.css === '') {
      document.body.classList.remove(CLASS_NAME);
      document.body.style.removeProperty(PREF_KEY);
    } else {
      document.body.classList.add(CLASS_NAME);
      document.body.style.setProperty(PREF_KEY, fontOptions.css);
    }

    Preferences.set(PREF_KEY, value);
    this.selectTarget.value = value;
  }

  loadFont(key) {
    const id = `db-loaded-font-${key.toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = this.options[key].load;
    document.head.appendChild(link);
  }
}

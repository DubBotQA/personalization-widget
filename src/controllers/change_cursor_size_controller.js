import { Controller } from '@hotwired/stimulus';
import { getConfig } from '../config.js';
import Preferences from '../preferences.js';

const PREF_KEY = 'db-cursor-size';
const DEFAULT_VALUE = 'default';

export default class extends Controller {
  static targets = ['select'];

  async connect() {
    this.config = await getConfig();

    this.options = this.config.cursorSize.options;
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
    const cursorOptions = this.options[value];

    // Remove any existing cursor classes
    this.removeAllCursorClasses();

    // Apply cursor size to body
    if (cursorOptions.css) {
      document.body.style.cursor = cursorOptions.css;
    } else {
      document.body.style.cursor = '';
    }

    // Apply cursor class if specified
    if (cursorOptions.class) {
      document.body.classList.add(cursorOptions.class);
    }

    Preferences.set(PREF_KEY, value);
    this.selectTarget.value = value;
  }

  removeAllCursorClasses() {
    // Remove all known cursor classes
    const cursorClasses = [
      'db-cursor-large',
      'db-cursor-extra-large'
    ];
    cursorClasses.forEach(cls => {
      document.body.classList.remove(cls);
    });
  }
}

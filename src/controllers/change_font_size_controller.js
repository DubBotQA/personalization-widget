import { Controller } from '@hotwired/stimulus';
import Preferences from '../preferences.js';
import { getConfig } from '../config.js';
import { initRange } from '../helpers/range_helper.js';

const PREF_KEY = '--db-font-size';
const CLASS_NAME = 'db-font-size-override';
const DEFAULT_VALUE = 100

export default class extends Controller {
  static targets = ['range', 'label'];

  async connect() {
    this.config = await getConfig();

    initRange(this.rangeTarget, this.config.fontSize);
    const value = Preferences.get(PREF_KEY) || DEFAULT_VALUE;
    this.rangeTarget.value = value
    this.change();
  }

  change() {
    const value = this.rangeTarget.value;
    this.updateLabelText(value);
    this.updateAriaValue(value);

    // Apply class and CSS variable approach similar to font-family
    if (value == 100) {
      document.body.classList.remove(CLASS_NAME);
      document.body.style.removeProperty(PREF_KEY);
    } else {
      document.body.classList.add(CLASS_NAME);
      document.body.style.setProperty(PREF_KEY, `${value}%`);
    }

    Preferences.set(PREF_KEY, value);
    this.rangeTarget.value = value
  }

  updateLabelText(value) {
    if (value == 100) {
      this.labelTarget.textContent = "Page Default";
    } else {
      this.labelTarget.textContent = `${value}%`;
    }
  }

  updateAriaValue(value) {
    this.rangeTarget.setAttribute('aria-valuenow', value);
    this.rangeTarget.setAttribute('aria-valuetext', value == 100 ? 'Page Default (100%)' : `${value}%`);
  }
}

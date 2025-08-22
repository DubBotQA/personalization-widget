import { Controller } from '@hotwired/stimulus';
import Preferences from '../preferences.js';
import { getConfig } from '../config.js';
import { initRange } from '../helpers/range_helper.js';

const PREF_KEY = '--db-letter-spacing';
const CLASS_NAME = 'db-letter-spacing-override';
const DEFAULT_VALUE = 0

export default class extends Controller {
  static targets = ['range', 'label'];

  async connect() {
    this.config = await getConfig();

    initRange(this.rangeTarget, this.config.letterSpacing);
    const value = Preferences.get(PREF_KEY) || DEFAULT_VALUE;
    this.rangeTarget.value = value;
    this.change();
  }

  change() {
    const value = this.rangeTarget.value;
    this.updateLabelText(value);
    this.updateAriaValue(value);
    Preferences.set(PREF_KEY, value);

    if (value > 0) {
      document.body.classList.add(CLASS_NAME);
      document.body.style.setProperty(PREF_KEY, `${value}px`);
    } else {
      document.body.classList.remove(CLASS_NAME);
      document.body.style.removeProperty(PREF_KEY);
    }
  }

  updateLabelText(value) {
    if (value == 0) {
      this.labelTarget.textContent = "Page Default";
    } else {
      this.labelTarget.textContent = `${value}px`;
    }
  }

  updateAriaValue(value) {
    this.rangeTarget.setAttribute('aria-valuenow', value);
    this.rangeTarget.setAttribute('aria-valuetext', value == 0 ? 'Page Default (0px)' : `${value}px`);
  }
}

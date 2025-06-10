import { Controller } from '@hotwired/stimulus';
import Preferences from '../preferences.js';
import { getConfig } from '../config.js';
import { initRange } from '../helpers/range_helper.js';

const PREF_KEY = '--db-letter-spacing';
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
    Preferences.set(PREF_KEY, value);

    if (value > 0) {
      document.body.style.setProperty(PREF_KEY, `${value}px`);
    } else {
      document.body.style.removeProperty(PREF_KEY);
    }
  }

  updateLabelText(value) {
    if(value == 0) {
      this.labelTarget.textContent = "Page Default";
    } else {
      this.labelTarget.textContent = `${value}px`;
    }
  }
}

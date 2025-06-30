// gets/sets values from localStorage

const STORAGE_KEY = 'dubbot-personalization';

export const Preferences = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  },

  get(variable) {
    return Preferences.getAll()[variable];
  },

  set(variable, value) {
    const current = Preferences.getAll();
    current[variable] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  },

  remove(variable) {
    const current = Preferences.getAll();
    delete current[variable];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export default Preferences;

import { Controller } from '@hotwired/stimulus';
export default class extends Controller {
  static targets = ['panel'];

  connect() {
    this.fonts = {
      default: '',
      sans: 'Arial, sans-serif',
      serif: 'Georgia, serif',
      opendyslexic: '"Open-Dyslexic", Arial, sans-serif'
    };
  }

  toggle() {
    this.panelTarget.classList.toggle('show');
  }

  changeFont(event) {
    const value = event.target.value;
    if (value === 'opendyslexic') this.loadOpenDyslexic();
    document.body.style.fontFamily = this.fonts[value];
  }

  loadOpenDyslexic() {
    if (document.getElementById('opendyslexic-font')) return;
    const link = document.createElement('link');
    link.id = 'opendyslexic-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.cdnfonts.com/css/open-dyslexic';
    document.head.appendChild(link);
  }
}

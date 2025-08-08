import { Controller } from '@hotwired/stimulus';
import Preferences from '../preferences.js';
import { getConfig } from '../config.js';

const PREF_KEY = 'db-reading-guide';
const CLASS_NAME = 'db-reading-guide-enabled';
const DEFAULT_VALUE = 'off'

export default class extends Controller {
  static targets = ['toggle'];

  async connect() {
    this.config = await getConfig();
    this.setupReadingGuide();

    const value = Preferences.get(PREF_KEY) || DEFAULT_VALUE;
    this.toggleTarget.checked = value === 'on';
    this.change();
  }

  setupReadingGuide() {
    if (!document.getElementById('db-reading-guide-container')) {
      const opacity = this.config.readingGuide.opacity || 0.6;
      const height = this.config.readingGuide.height || 60;
      const fadePx = 12;

      const container = this.createContainer();
      const topOverlay = this.createTopOverlay(opacity, fadePx);
      const bottomOverlay = this.createBottomOverlay(opacity, fadePx);

      container.appendChild(topOverlay);
      container.appendChild(bottomOverlay);
      document.body.appendChild(container);

      this.setupMouseTracking(height);
    }
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'db-reading-guide-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
      display: none;
    `;
    return container;
  }

  createTopOverlay(opacity, fadePx) {
    const topOverlay = document.createElement('div');
    topOverlay.id = 'db-reading-guide-top';
    topOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      /* Solid to subtle fade near the bottom edge */
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, ${opacity}) 0%,
        rgba(0, 0, 0, ${opacity}) calc(100% - ${fadePx}px),
        rgba(0, 0, 0, 0) 100%
      );
    `;
    return topOverlay;
  }

  createBottomOverlay(opacity, fadePx) {
    const bottomOverlay = document.createElement('div');
    bottomOverlay.id = 'db-reading-guide-bottom';
    bottomOverlay.style.cssText = `
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 0;
      /* Subtle fade near the top edge to solid */
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, ${opacity}) ${fadePx}px,
        rgba(0, 0, 0, ${opacity}) 100%
      );
    `;
    return bottomOverlay;
  }

  setupMouseTracking(height) {
    // Cache DOM elements to avoid repeated queries
    this.topElement = document.getElementById('db-reading-guide-top');
    this.bottomElement = document.getElementById('db-reading-guide-bottom');

    // Throttle mouse updates for better performance
    let animationFrame = null;

    this.mouseMoveHandler = (e) => {
      if (document.body.classList.contains(CLASS_NAME)) {
        if (animationFrame) return;

        animationFrame = requestAnimationFrame(() => {
          this.updateOverlayPositions(e.clientY, height);
          animationFrame = null;
        });
      }
    };

    document.addEventListener('mousemove', this.mouseMoveHandler);
  }

  updateOverlayPositions(cursorY, height) {
    if (this.topElement && this.bottomElement) {
      const guideTop = Math.max(0, cursorY - height / 2);
      const guideBottom = Math.max(0, window.innerHeight - (cursorY + height / 2));

      this.topElement.style.height = `${guideTop}px`;
      this.bottomElement.style.height = `${guideBottom}px`;
    }
  }

  change() {
    const isEnabled = this.toggleTarget.checked;
    const value = isEnabled ? 'on' : 'off';

    const container = document.getElementById('db-reading-guide-container');

    if (isEnabled) {
      document.body.classList.add(CLASS_NAME);
      if (container) {
        container.style.display = 'block';
      }
    } else {
      document.body.classList.remove(CLASS_NAME);
      if (container) {
        container.style.display = 'none';
      }
    }

    Preferences.set(PREF_KEY, value);
  }

  disconnect() {
    // Clean up event listener when controller is destroyed
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }
}

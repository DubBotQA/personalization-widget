import html from './widget.html?raw';
import css from './widget.css?raw';
import { Application } from '@hotwired/stimulus';
import WidgetController from './controllers/widget_controller.js';

function injectWidget() {
  // Load Bootstrap CSS
  const bootstrap = document.createElement('link');
  bootstrap.rel = 'stylesheet';
  bootstrap.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  document.head.appendChild(bootstrap);

  // Inject widget CSS
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Inject widget HTML
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  // Start Stimulus
  const app = Application.start();
  app.register('widget', WidgetController);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectWidget);
} else {
  injectWidget();
}


# Personalization Widget

(Work in Progress)

- Drop in this widget to add some basic personalization options to your website.
- **Not a drop-in replacement for proper site accessibility!**
- There is still plenty to do here. This is just getting started.

## Getting Started

To add the Personalization Widget to your website, add the script to your page:
```html
<script src="https://example.com/db-personalization-widget.bundle.js"></script>
```

### Configuration

To customize the appearance/functionality of the widget, create a JSON config file and pass its URL to the `data-db-personalization-widget-config-url` attribute on script tag:
```html
<script src="https://example.com/db-personalization-widget.bundle.js" data-db-personalization-widget-config-url="https://example.com/widget-config.json"></script>
```

The configuration JSON is based on the `defaultConfig` object in `src/config.js`.

Example JSON config:
```json
{
  "fontFamily": {
    "options": {
      "comicsans": { "label": "Comic Sans", "css": "'Comic Sans MS', cursive" }
    }
  },
  "ui": {
    "title": "Personalize Website",
    "description": "Don't like how our page looks? Use these knobs.",
    "theme": {
      "colors": {
        "primary": "#000000",
        "bodyFont": "#FFFFFF",
        "primaryFont": "#FFFFFF"
      }
    }
  },
  "show": [
    "change_font_family",
    "change_font_size", 
    "change_color_contrast"
  ]
}
```
This example:
- Adds the Comic Sans font to the font family dropdown.
- Updates the title and description inside the widget
- Updates the primary, body font, and primary font colors.
- Shows only the `change_font_family`, `change_font_size`, and `change_color_contrast` controls

When no configuration is provided, the widget will use the default configuration (see `defaultConfig` in `src/config.js`).

## Features

The Personalization Widget currently provides the following accessibility options:

- **Font Family Selection**: Choose from Sans Serif, Serif, OpenDyslexic, and other font options
- **Font Size Adjustment**: Scale text from 100% to 500% in 25% increments
- **Letter Spacing Control**: Adjust letter spacing from 0px to 5px for improved readability
- **Cursor Size Options**: Choose from Default, Large, and Extra Large cursor sizes for improved visibility
- **Color Contrast Options**: Apply visual filters including:
  - High Contrast mode
  - Inverted Colors
  - Dark Mode
  - Dark High Contrast
  - Sepia tone
  - Grayscale

  *Note: All visual filters are applied to page content while keeping the widget itself unaffected for optimal usability.*
- **Persistent Settings**: User preferences are saved and restored across sessions
- **Configurable Interface**: Customize appearance and available options via JSON configuration

## Development & Contributing

### Project Structure

- `src/` – main JavaScript source files (Stimulus controllers, helpers, config loader)
- `src/controllers/` – Stimulus controllers for each control module
- `src/helpers/` – Helper functions  
- `src/ui/` – HTML fragments for each control module
- `src/widget-postcss.css` – PostCSS-enhanced widget styles
- `src/page-overrides.css` – CSS overrides applied to the host page
- `postcss.config.js` – PostCSS configuration for modern CSS features
- `dist/` – built assets (via Vite)

### CSS Architecture

This project uses **PostCSS** for modern CSS features:
- CSS nesting and custom properties
- Automatic vendor prefixes
- Style scoping to prevent conflicts
- Production minification
- Shadow DOM isolation for widget styles

### Local Development

1. Clone the repo
  ```sh
    git clone https://github.com/YOUR_ORG/personalization-widget.git
    cd personalization-widget
  ```
2. Install dependencies
  ```sh
    npm install
  ```
3. Start Dev Server
  ```sh
    npm run dev
  ```
4. Open the URL shown in your terminal (typically http://localhost:5173/) in the browser to test locally.

### Building

Generate a deployable db-personalization-widget.bundle.js:
```sh
npm run build
```
This outputs a single, self-contained bundled file to `dist/db-personalization-widget.bundle.js` that includes:
- All JavaScript functionality
- PostCSS-processed widget styles 
- Bootstrap CSS
- Page override styles

The widget requires no separate CSS files - everything is embedded in the JavaScript bundle for easy deployment.

## Contributing
- Open a [GitHub issue](https://github.com/DubBotQA/personalization-widget/issues) for feature requests or bug reports
- Pull requests welcome

## License

This project is released under the [MIT License](https://github.com/DubBotQA/personalization-widget/blob/main/LICENSE). You’re free to use, modify, and distribute it for personal or commercial use.

## Open Source Attributions

This project uses the following open source libraries:

- **[Bootstrap](https://getbootstrap.com/)**
Licensed under [MIT License](https://github.com/twbs/bootstrap/blob/main/LICENSE)

- **[Stimulus](https://stimulus.hotwired.dev/)**
Licensed under [MIT License](https://github.com/hotwired/stimulus/blob/main/LICENSE.md)

- **[OpenDyslexic Font](https://opendyslexic.org/)**
Licensed under [SIL Open Font License 1.1](https://scripts.sil.org/OFL)

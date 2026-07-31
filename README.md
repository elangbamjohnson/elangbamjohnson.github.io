# Johnson Elangbam - Personal Portfolio

A sleek, performant, and responsive personal portfolio website designed with a custom CSS architecture and a modern Bento-grid layout. This repository serves as the source code for my personal domain, showcasing my engineering experience, projects, and case studies.

## 🚀 Features

- **Custom Bento Grid Layout**: Built with a lightweight, bespoke CSS design system focusing on modular `bento-item` cards, dynamic hover states, and smooth scaling.
- **Scroll-Triggered Animations**: Dependency-free vanilla JavaScript powers subtle, staggered reveal animations (`reveal-init`, `reveal-visible`) as elements scroll into view, providing a premium feel without heavy libraries like GSAP.
- **Dynamic Navigation System**: Features an intelligent sticky navigation bar with a sliding "pill" background that tracks the active scroll section in real-time.
- **Interactive Modals**: Fully accessible, custom-built HTML/JS modals for case studies and demo videos. Features include backdrop blurring (`backdrop-filter`), focus trapping, `Escape` key handling, and auto-pausing HTML5 video.
- **Mobile-First Responsiveness**: Hand-crafted `@media` queries ensure pixel-perfect typography, padding, and layout reflowing down to 320px screen widths.

## 🛠️ Technology Stack

- **HTML5**: Semantic and accessible markup.
- **CSS3**: Custom design tokens (CSS variables), Flexbox/Grid layouts, and modern CSS features (e.g., `backdrop-filter`, `prefers-reduced-motion`).
- **Vanilla JavaScript**: Lightweight DOM manipulation, Intersection Observers for animations, and modal state management. Zero external dependencies.

## 📁 Project Structure

```text
.
├── index.html          # Main application entry point
├── assets/
│   ├── css/
│   │   └── styles.css  # Core design system and layout rules
│   ├── js/
│   │   ├── main.js     # Modal logic and navigation state tracking
│   │   └── animations.js # Scroll-triggered Intersection Observer
│   ├── images/         # Profile pictures and project assets
│   ├── videos/         # Local demo MP4s
│   └── resume/         # Downloadable PDF resume
└── README.md
```

## 💻 Running Locally

Since this project relies on vanilla web technologies, no build step is required. 

1. Clone the repository:
   ```bash
   git clone https://github.com/elangbamjohnson/elangbamjohnson.github.io.git
   ```
2. Navigate to the project directory:
   ```bash
   cd elangbamjohnson.github.io
   ```
3. Open `index.html` in your browser, or start a local dev server:
   ```bash
   npx serve .
   ```

## 📜 License

&copy; 2026 Johnson Elangbam. All rights reserved.
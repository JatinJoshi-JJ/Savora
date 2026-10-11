# 🍜 SAVORA — 2-Minute Masala Magic | AI Culinary Experience ✨

> An artisanal, interactive culinary web experience celebrating the iconic **2-Minute Masala Noodles**, powered by Gemini AI Sous-Chef customization, dynamic servings math, step-by-step cook mode, and buttery smooth Lenis scrolling.

---

## 🌟 Overview

**SAVORA** reimagines comfort food through modern web craftsmanship. It combines the nostalgic warmth of India's favorite golden noodle bowl with intelligent kitchen utilities, micro-interactions, Web Audio chime synthesis, and responsive editorial aesthetics.

---

## ✨ Key Features

### 🍜 Artisanal Recipe Card & Live Scaler
- ⚖️ **Dynamic Servings Stepper**: Automatically recalculates water ratios (300 ml rule), noodle cakes, and spice sachets in real time (scales from 1 to 12 servings).
- ✅ **Interactive Prep Checklist**: Interactive checkboxes with state persistence in `localStorage` so you never miss an ingredient.
- 💡 **Chef's Pro Tips**: Quick culinary notes on emulsion, vegetable crispness, and cold butter glazing.

### 🤖 Gemini AI Sous-Chef (Interactive Drawer)
- 💬 **Live Culinary Assistant**: Instant advice for fixing watery broth, street-style spicy hacks, microwave adjustments, and cheese melting secrets.
- ⚡ **One-Tap Quick Chips**: Instant prompt chips for rapid kitchen troubleshooting.
- 🔒 **Scroll-Lock Protected**: Smooth internal scrolling with `data-lenis-prevent` integration.

### 🧪 AI Flavor Alchemist (Custom Bowl Remixes)
- 🌶️ **Street Style Butter Tadka**: Fiery green chili, sizzling butter & lemon juice finish.
- 🧀 **Café Velvety Cheese Melt**: Creamy cheese slice emulsion with rich spice glaze.
- 🥢 **Chili Garlic Schezwan Toss**: Indo-Chinese street-style stir-fry variation.
- 🥣 **Homestyle Winter Broth**: Soothing extra-herb aromatic vegetable broth.

### 👨‍🍳 Step-by-Step Cooking Companion
- 📖 **Guided Stovetop Walkthrough**: 6 structured stages with visual progress tracking.
- 🔊 **Voice Speech Synthesis**: Built-in Web Speech API (`speechSynthesis`) narrates cooking steps aloud hands-free.
- 🎵 **Web Audio Chimes**: Custom oscillator chime sound effects on actions with zero external audio assets.

### ⏱️ Smart 2-Minute Simmer Timer
- ⏳ **Interactive Countdown**: Clean circular SVG progress ring and millimeter-precise timer controls.
- 🔔 **Audio Alert Finish**: Automatic synthesized chime alert when simmering completes.

### 💡 Expanded Kitchen Tips & FAQ Accordion
- ❓ **7 Expert Culinary Q&As**: Explaining the science of the 300 ml water ratio, vegan substitutes, veggie textures, microwave methods, and starch osmosis.
- 🎯 **Smooth Animated Disclosures**: Pure CSS grid accordion animations with accessible `aria-expanded` attributes.

### 🌓 Daylight & Midnight Theme Toggle
- ☀️ **Daylight Maggi Theme**: Warm cream, golden yellow, and signature Maggi red accents.
- 🌙 **Midnight Kitchen Theme**: Deep roasted espresso tones with high-contrast text and glowing badges.
- 🔄 **Intuitive Action Icons**: Shows 🌙 in Light mode (switch to dark) and ☀️ in Dark mode (switch to daylight).

### 🚀 Performance & UI Excellence
- 🌊 **Lenis Smooth Scrolling**: Integrated Studio Freight Lenis v1 engine for effortless scrolling physics.
- 📱 **Animated Mobile Hamburger Menu**: Fluid 3-line to "X" cross-icon transformation with dropdown drawer navigation.
- 🧼 **Seamless Hidden Scrollbar**: Global scrollbar visibility hidden on the Y-axis while preserving 100% fluid scrollability.
- 🖨️ **Print-Optimized Stylesheet**: Formatted print view hiding navigation and decorative UI for clean paper recipes.

---

## 🛠️ Tech Stack

- **Markup**: HTML5 (Semantic, SEO meta tags, OpenGraph ready)
- **Styling**: Vanilla CSS3 (Custom properties, CSS Grid, Flexbox, Glassmorphism, Zero frameworks)
- **Scripting**: Vanilla JavaScript (ES6+, Web Audio API, Web Speech API, LocalStorage)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) (`lenis@1.1.18`)
- **Typography**: Google Fonts (*Playfair Display*, *DM Sans*, *JetBrains Mono*)

---

## 📂 Project Structure

```bash
recipecardpage/
├── assets/
│   └── images/
│       └── maggie.jpg         # Hero culinary photography
├── index.html                 # Main web application structure
├── style.css                  # Custom design system & animations
├── script.js                  # Audio synth, Lenis, timer, stepper & AI logic
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

No build tools or package managers required. Simply run with any local static server:

### Option 1: VS Code Live Server
1. Open the project in **VS Code**.
2. Right click `index.html` and click **"Open with Live Server"**.

### Option 2: Python HTTP Server
```bash
# Navigate to the project directory
cd recipecardpage

# Start a local HTTP server
python3 -m http.server 8000
```
Then visit **`http://localhost:8000`** in your browser.

### Option 3: Node `serve` or `npx http-server`
```bash
npx serve .
```

---

## ⌨️ Accessibility & UX Highlights

- ♿ **Focus Rings**: Custom `:focus-visible` outline rings for keyboard-only navigation.
- ⏭️ **Skip Link**: `Skip to recipe content` keyboard bypass mechanism.
- 🔊 **Voice Narration**: Hands-free stovetop cooking mode designed for busy kitchen counters.
- 📱 **Fluid Breakpoints**: Optimized for ultra-compact mobile (360px) up to high-DPI desktop viewports.

---

## ❤️ Credits & Acknowledgments

- Inspired by the timeless comfort of **Nestlé Maggi 2-Minute Noodles**.
- Smooth scroll powered by **Studio Freight / Darkroom Engineering Lenis**.
- Fonts by **Google Fonts**.

---

<p align="center">
  <b>Good Food, Good Mood! ❤️</b><br />
  &copy; SAVORA &times; Maggi Product Experience
</p>
# Savora

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</p>

<h1 align="center">✨ Qraft</h1>

<p align="center">
  <strong>Encode anything into a scannable mark — a free, custom QR code generator.</strong>
</p>

<p align="center">
  <a href="https://qraft.ashutoshswamy.in">Live</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#license">License</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **5 Pattern Styles** | Squares, Dots, Rounded, Classy, Elegant |
| 🌈 **6 Color Presets** | Classic, Indigo, Ocean, Emerald, Rose, Violet |
| 📐 **3 Size Options** | Small (150px), Medium (200px), Large (280px) |
| 📥 **PNG Download** | High-quality 2x resolution export |
| ⚡ **Real-time Preview** | Instant QR code generation as you type |
| 🎭 **Smooth Animations** | Scan-line reveal and micro-interactions with Framer Motion |
| 🔍 **SEO Ready** | Structured data, sitemap, robots.txt, Open Graph & Twitter cards |
| 🔒 **Hardened Headers** | CSP, HSTS, X-Frame-Options, and more via `next.config.ts` |

## 🚀 Demo

Try it live at **[qraft.ashutoshswamy.in](https://qraft.ashutoshswamy.in)**, or run it locally:

```bash
git clone https://github.com/ashutoshswamy/qraft.git
cd qraft
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashutoshswamy/qraft.git
   cd qraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React Framework (App Router) |
| [React 19](https://react.dev/) | UI Library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [DM Sans / DM Mono](https://fonts.google.com/specimen/DM+Sans) | Typography |

## 📁 Project Structure

```
qraft/
├── app/
│   ├── components/
│   │   ├── Background.tsx    # Module-grid + finder-mark watermark
│   │   ├── QRGenerator.tsx   # Main QR generator
│   │   └── BrandIcons.tsx    # Inline brand-mark SVGs (GitHub, LinkedIn, X)
│   ├── types/
│   │   └── cheprasov-qrcode.d.ts
│   ├── globals.css           # Design tokens (paper/ink/laser/signal)
│   ├── layout.tsx            # Root layout, fonts, SEO metadata, JSON-LD
│   ├── page.tsx               # Home page
│   ├── robots.ts              # robots.txt
│   └── sitemap.ts             # sitemap.xml
├── public/                   # Static assets (icons, og-image.png)
├── next.config.ts            # Security headers (CSP, HSTS, ...)
└── package.json
```

## 👨‍💻 Author

**Ashutosh Swamy**

- Portfolio: [ashutoshswamy.in](https://ashutoshswamy.in)
- GitHub: [@ashutoshswamy](https://github.com/ashutoshswamy)
- LinkedIn: [@ashutoshswamy](https://linkedin.com/in/ashutoshswamy)
- X: [@ashutoshswamy_](https://x.com/ashutoshswamy_)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ashutoshswamy">Ashutosh Swamy</a>
</p>

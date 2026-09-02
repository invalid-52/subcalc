# SUBCALC — Subscription Calculator 💳

A fast, clean, and intuitive personal subscription and recurring-expense calculator built with React and Vite.

> **"Know exactly where your recurring money goes."**

---

## ✨ Features

- **⚡ Fast & 100% Client-Side**: No signup, no trackers, no external APIs. All data persists locally in your browser.
- **📊 Dominant Financial Dashboard**:
  - Total Monthly & Yearly spending
  - Weekly and Daily equivalents
  - Active vs Paused subscriptions
  - Average monthly commitment per service
- **🎯 Accurate Normalization Engine**:
  - Weekly (`price × 52 / 12`)
  - Monthly (`price`)
  - Quarterly (`price / 3`)
  - Half-Yearly (`price / 6`)
  - Yearly (`price / 12`)
- **🌐 Multi-Currency Support**: USD ($), INR (₹), EUR (€), GBP (£), JPY (¥), CAD (CA$), AUD (A$), CHF (CHF) formatted via `Intl.NumberFormat`.
- **🎨 25+ Popular Service Presets**: Netflix, Spotify, YouTube Premium, ChatGPT Plus, Claude Pro, Apple Music, Disney+, iCloud+, Notion, Figma, Xbox Game Pass, and many more, plus full **Custom Service** creation.
- **📈 Spending Breakdown**: Visual stacked distribution bar with category breakdown chips and percentages.
- **💡 Smart Insights**: Data-backed observations regarding top expenses, dominant categories, and average costs.
- **💰 Savings Optimization**: Mark subscriptions as **"Keep"** vs **"Review"** to calculate potential monthly and annual savings.
- **📅 Upcoming Renewals Schedule**: Chronological upcoming payment dates with relative countdown badges (*Due today*, *Due in 3 days*, *1 day overdue*).
- **🔍 Instant Search, Filter & 5-Way Sorting**: Search by name/category/notes, filter by category/cycle/status, and sort by highest/lowest cost, name, or recently added.
- **📦 Data Portability**: Export and import complete backups as JSON (Schema 2.0.0) with automatic legacy format migration.
- **🌓 Theme & Accessibility**: Dark Mode, Light Mode, and System theme with full keyboard accessibility and mobile responsiveness.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Pure Vanilla CSS with CSS Custom Properties (Tokens)
- **Persistence**: Browser `localStorage` with error recovery and schema versioning
- **Icons**: Embedded semantic SVGs

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
# Clone repository
git clone <YOUR_GITHUB_REPO_URL>
cd subscription-calculator

# Install dependencies
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🚢 Deployment

Deploy in seconds with any static hosting platform:

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
```bash
npm install -D gh-pages
# Add "deploy": "gh-pages -d dist" to package.json scripts
npm run build
npm run deploy
```

---

## 🔒 Privacy & Security

All financial calculations and subscription data are processed and stored **100% locally** in your browser's `localStorage`. No data is ever transmitted to any external server.

---

## 📄 License

MIT License. Free to use, modify, and distribute.

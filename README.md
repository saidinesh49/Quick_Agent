# 🚀 Quick-Agent
**Smart Agentic Web Automation Companion (Chrome Extension)**

Quick-Agent is a Chrome extension that automates real web tasks using simple user instructions.  
Instead of just showing links or suggestions, it navigates websites and completes multi-step actions directly inside the browser.

---

## ✨ Features
- Automates repetitive web tasks like searching, shopping, and booking
- Works directly inside the browser as a Chrome extension
- Executes complete workflows, not just suggestions
- Simple and usable for non-technical users

---

## How It Works
1. User provides a simple instruction  
   *(e.g., “Find a cheap men’s T-shirt and add it to cart”)*
2. Quick-Agent understands the intent
3. The agent navigates the website and performs required actions
4. The task is completed automatically inside the browser

---

## 🛠 Tech Stack
- JavaScript / TypeScript
- React
- Node.js
- Chrome Extension API
- WebExtension Polyfill
- TurboRepo
- Vite
- Tailwind CSS

---

## 📦 Installation & Setup

### Prerequisites
- Node.js `>= 22.12.0`
- pnpm `>= 9.15.1`

> [!IMPORTANT]  
> Use **pnpm**, not npm. Using npm may cause dependency issues.

---

### Install Dependencies
```bash
pnpm install
```

### Build the Extension
```bash
pnpm build
```
After a successful build, a `dist/` folder will be generated.

---


## How To add Quick-Agent to your chrome.

###  Step-1: 
 - Either follow "installation & setup" 
 OR [click Here](https://github.com/saidinesh49/Quick_Agent/releases/download/V1.0.1/dist.zip.zip) and extract the downloaded folder.

### Step-2:
1. Open Google Chrome
2. Go to `chrome://extensions`
3. Enable `Developer Mode`
4. Click `Load unpacked`
5. Select the `dist` folder inside the `Quick_Agent` project

### Step-3:
 - Now Pin the Quick Agent in extensions, for easy access.

### Step 4:
- Click **Quick-Agent** from the extensions toolbar
- The Quick-Agent side panel will open
- Click the **:gear: Settings** option in the side panel
- Go to the **Model** section and paste your **Gemini API key**  
  *(Get your API key here: https://aistudio.google.com/api-keys)*


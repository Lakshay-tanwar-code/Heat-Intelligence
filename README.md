<div align="center">

# 🛡️ GridShield
**AI Thermal Resilience & Parametric Grid Protection**

[![Live Demo](https://img.shields.io/badge/Live_Demo-weather--forecasting--fortyguard.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://weather-forecasting-fortyguard.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)]()
[![FortyGuard](https://img.shields.io/badge/Powered_by-FortyGuard_AI-ff4500?style=for-the-badge)]()

*Built for the FortyGuard "Building the World's Temperature AI" Hackathon.*

[View Live Demo](https://weather-forecasting-fortyguard.vercel.app/) · [Report Bug](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/issues) · [Request Feature](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/issues)

</div>

---

## 📖 The Vision

Extreme urban heat is the silent killer of modern electrical infrastructure. When heatwaves strike, standard regional weather forecasts fail to capture street-level thermal traps, causing utility transformers to degrade, overheat, and fail. 

**GridShield** is an AI-driven command center that shifts grid management from reactive troubleshooting to proactive resilience. By combining real-time thermal telemetry with automated parametric insurance protocols, it protects both the physical grid and the utility's financial liquidity.

---

## 📸 Dashboard Preview

> **Note:** Replace this placeholder with a screenshot of your live Vercel dashboard!
> 
> `<img src="https://via.placeholder.com/1000x500/1a1a1a/ffffff?text=Add+Screenshot+of+GridShield+Dashboard+Here" alt="GridShield Dashboard" width="100%">`

---

## ✨ Key Features

* **📍 Live Substation Telemetry:** Maps core transformer operating temperatures against live ambient conditions across distributed grid nodes in high-risk cities (Phoenix, LA, Dubai).
* **🗺️ High-Resolution Pixel Heatmap:** Renders a dynamic, granular (60m-80m) GeoJSON tile grid showing exact heat distribution across city blocks.
* **🌡️ Heat Spike Simulation:** Interactive slider to model sudden ambient temperature surges and observe immediate thermal degradation impacts across all grid nodes.
* **💸 Parametric Auto-Settlements:** Continuously tracks verifiable heat thresholds (e.g., 4 days > 42°C). When breached, it instantly triggers pre-agreed financial payouts to cover emergency operational costs.
* **🚨 Rapid Emergency Dispatch:** Direct integration with Thermo King Support and first responders for immediate transformer cooling unit dispatch.

---

## 🏗️ Architecture & Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Blazing fast, component-driven UI with dark-mode styling. |
| **Maps** | Leaflet / GeoJSON | Dynamic polygon rendering for the FortyGuard tile grid. |
| **AI Integration** | FortyGuard APIs | Utilizes `/v1/heat_intelligence` and `/v1/heatmap` for spatial data. |
| **Deployment** | Vercel | Serverless hosting with continuous integration (CI/CD). |

---

## 🔌 Integrating FortyGuard Temperature AI

GridShield relies heavily on FortyGuard's Large Temperature Models (LTMs) to function:
1. **Hyper-Local Precision:** We hit the Heat Intelligence endpoint to map ambient conditions directly to exact substation coordinates, bypassing inaccurate regional weather data.
2. **Asynchronous Polling:** We implemented a two-step `POST` $\rightarrow$ `GET` polling architecture for the Heatmap endpoint to generate high-resolution thermal grids.
3. **Robust Data Parsing:** Strict parsing rules in our backend handle `null` sensor points to ensure parametric risk calculations are never skewed by missing data.

---

## 🚀 Run it Locally

Follow these steps to spin up the GridShield environment on your local machine.

### 1. Clone & Install
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
npm install

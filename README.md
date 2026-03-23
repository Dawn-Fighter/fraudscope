# 🛡️ FraudShield | Real-Time Fraud Intelligence

**FraudShield** is a state-of-the-art, high-density fraud monitoring dashboard designed for real-time transaction intelligence. It leverages reactive data streams to detect fraudulent patterns such as impossible travel, velocity spikes, and high-risk merchant categories.

## 📊 Key Features

- **Real-Time Fraud Feed**: Live-streaming alerts for suspicious transactions with instant "Freeze" or "Safe" action capabilities.
- **Dynamic Risk Intelligence**: Includes Impossible Travel detection, Velocity Spikes, and Heatmap analysis of incident density.
- **Advanced Data Visualizations**: Comparing legitimate vs. fraudulent transaction volumes through interactive charts (using `Recharts` and `D3`).
- **AI Insights Ready**: Integrated AI notification system that surfaces newly detected fraud patterns and anomalies.
- **Data Portability**: Full support for exporting comprehensive dashboard data into PDF reports.
- **Live Attack Simulation**: Toggle dynamic transaction attacks to test detection thresholds and system response.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, Framer Motion
- **Styling**: Tailwind CSS 4 with custom glassmorphism and high-density UI components
- **Charting**: Recharts, D3.js, React-Simple-Maps
- **Data Handling**: SWR (Stale-While-Revalidate) for high-performance reactive updates
- **PDF Generation**: @react-pdf/renderer

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- NPM or YARN

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Dawn-Fighter/fraudscope.git
    cd fraudscope
    ```

2.  **Install dependencies**:
    Due to the cutting-edge versions used (Next 16, React 19), please use the legacy peer deps flag if you encounter resolution conflicts:
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the dashboard**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```bash
src/
├── app/                  # Next.js App Router (Pages & API Routes)
├── components/           
│   ├── dashboard/       # Core analytics & chart components
│   ├── ai/              # AI-driven conversation & insight UI
│   ├── pdf/             # PDF generation and export logic
│   └── ui/              # Reusable high-density UI primitives
└── lib/                 # Shared data loaders and utility functions
```

## 📈 Dashboard Highlights

- **Transaction Velocity**: 24-hour comparative monitoring of txn volume.
- **Geographic Risk Map**: Visualizing global exposure and incident hotspots.
- **Threat Radar**: Mapping multi-dimensional risk scores across diverse categories.
- **Heatmap Intelligence**: Analyzing peak hours for fraudulent activity across the week.

## ⚖️ License

Private Project. Created for high-density fraud monitoring and intelligence.

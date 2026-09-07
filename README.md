# FactoryPulse V1 - Production Reporting Web Application

FactoryPulse V1 is a mobile-first production reporting web application engineered for small and medium manufacturing companies, optimized for supervisors on shop-floor smartphones and factory owners on desktops.

## Demo Context
- **Factory:** Pune Precision Components
- **Demo Date:** 05 September 2026
- **Current Shift:** Shift A
- **Machinery:** 10 CNC Units (CNC-01 to CNC-10)

## Quick Start (Run Locally)

Run the local web server using Python (pre-installed):

```bash
python -m http.server 3000
```

Then open your browser and navigate to:
```
http://localhost:3000
```

To view the original raw Stitch export reference directly:
```
http://localhost:3000/code.html
```

## Project Architecture (Phase 1)

```
stitch_factorypulse_production_reporting_app/
├── index.html                  # Modular application shell & Tailwind theme config
├── package.json                # Project manifest & execution scripts
├── README.md                   # Project documentation & local running instructions
├── code.html                   # Original approved Google Stitch export (preserved intact)
├── DESIGN.md                   # Approved Stitch design tokens & typography specification
├── screen.png                  # Visual source of truth reference
└── src/
    ├── main.js                 # App entry point, DOM mounting & event handling
    ├── state.js                # Central reactive state manager & observer bus
    ├── assets/
    │   └── assets.js           # Embedded SVG vector assets for brand logo & user avatar
    ├── data/
    │   └── demoData.js         # Factory metadata, 10 CNC machines & Shift A production logs
    ├── components/
    │   ├── Header.js           # Top application bar with Pune Precision badge & shift indicator
    │   ├── BottomNav.js        # Mobile-first 5-tab bottom navigation with active states
    │   ├── FilterBar.js        # Filter carousel (Date, Shift, Machine, Status) & quick search
    │   ├── AggregateStrip.js   # Dynamic Shift Telemetry summary strip
    │   ├── ProductionCard.js   # Machine production card matching approved Stitch styling
    │   └── Toast.js            # Toast notification component
    └── views/
        ├── HistoryView.js      # Approved Stitch Shift History view
        ├── EntryView.js        # Supervisor Entry scaffold (Phase 3)
        ├── DashboardView.js    # Owner Dashboard scaffold (Phase 5)
        ├── MachinesView.js     # Machine Directory scaffold (Phase 4)
        └── MoreView.js         # Facility Settings scaffold
```

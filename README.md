# Open-Shelf (WIP)

**Open-Shelf** is a local-first prototype for crowdsourced grocery price transparency.  
Users can upload receipt photos from their phones; a FastAPI backend receives the files (OCR/analysis coming soon).

> ⚠️ **Status:** actively under development — features, routes, and UI may change.

---

## What’s inside

- `server/` — **FastAPI** backend (file upload endpoint + future OCR pipeline)
- `client/` — **React** app (camera/upload flow)
- `start_dev.bat` — one-click **Windows** launcher (starts both servers)

---

## Windows-only setup (reviewers)

### Prerequisites
- **Windows 10/11**
- **Python 3.10+** (check “Add Python to PATH” during install)
- **Node.js (LTS)** — provides `npm`
- **Git** (to clone the repo)

### Quick start (recommended)
1. **Clone** the repo:
   ```bat
   git clone https://github.com/TASHINOV10/open-shelf
   cd open-shelf
   ```


2. **Double-click** start_dev.bat.

The launcher will:

- create a venv if missing,
- install Python deps from requirements.txt,
- run FastAPI on http://0.0.0.0:8000,
- install client deps (if needed),
- run React on http://localhost:3000 (bound for LAN testing).
- Open the app at: http://localhost:3000
- On first run, Windows Firewall may prompt for Python/Node — click Allow for Private networks.

## Phone Testing

- On Windows: Settings → Network & Internet → Mobile hotspot
- Turn hotspot On (share your internet connection).

From your phone (connected to the laptop’s hotspot), visit:

-React: http://192.168.137.1:3000
-FastAPI docs: http://192.168.137.1:8000/docs

If blocked, allow Python and Node.js through Windows Firewall (Private).
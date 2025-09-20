@echo off
setlocal

REM === Absolute repo root (this .bat's folder) ===
set "ROOT=%~dp0"
set "VENV=%ROOT%venv"
set "PY=%VENV%\Scripts\python.exe"

REM === 1) Ensure virtual env exists; if not, create + install deps ===
if not exist "%PY%" (
  echo [setup] Creating virtual environment...
  py -3 -m venv "%VENV%" || (
    echo [error] Could not create venv with 'py'. Trying 'python'...
    python -m venv "%VENV%" || (
      echo [fatal] Failed to create virtual environment.
      exit /b 1
    )
  )
  echo [setup] Installing Python dependencies...
  "%PY%" -m pip install --upgrade pip
  if exist "%ROOT%requirements.txt" (
    "%PY%" -m pip install -r "%ROOT%requirements.txt"
  ) else (
    echo [warn] requirements.txt not found. Skipping Python deps.
  )
) else (
  echo [info] Using existing virtual environment at "%VENV%"
)

REM (Optional) Always refresh deps even if venv exists:
REM "%PY%" -m pip install -r "%ROOT%requirements.txt"

REM === 2) Start FastAPI (run from repo root so 'server' is importable) ===
start "FastAPI" cmd /k ^
  cd /d "%ROOT%" ^&^& ^
  set "PYTHONPATH=%ROOT%" ^&^& ^
  "%PY%" -m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir "%ROOT%server"

REM === 3) Start React (bind to LAN using modern WDS vars) ===
start "React" cmd /k ^
  cd /d "%ROOT%client" ^&^& ^
  set WDS_HOST=0.0.0.0 ^&^& ^
  set WDS_ALLOWED_HOSTS=all ^&^& ^
  set PORT=3000 ^&^& ^
  npm start

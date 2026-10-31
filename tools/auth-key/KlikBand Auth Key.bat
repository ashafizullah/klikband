@echo off
rem Double-click to run KlikBand Auth Key. Uses Python 3.9+ when Windows has it,
rem otherwise downloads a private copy once (python.org embeddable zip, about
rem 10 MB) into %LOCALAPPDATA%\KlikBand\python.
setlocal
chcp 65001 >nul
title KlikBand Auth Key
set "HERE=%~dp0"
set "PYDIR=%LOCALAPPDATA%\KlikBand\python"
set "PYVER=3.12.10"

if not exist "%HERE%auth_key.py" goto unzipped

if exist "%PYDIR%\python.exe" goto embedded
py -3 -c "import sys; sys.exit(sys.version_info < (3, 9))" >nul 2>nul
if not errorlevel 1 goto launcher

echo Menyiapkan Python (sekali saja, sekitar 10 MB)...
set "ARCH=amd64"
if /i "%PROCESSOR_ARCHITECTURE%"=="ARM64" set "ARCH=arm64"
if /i "%PROCESSOR_ARCHITECTURE%"=="x86" if not defined PROCESSOR_ARCHITEW6432 set "ARCH=win32"
set "KB_URL=https://www.python.org/ftp/python/%PYVER%/python-%PYVER%-embed-%ARCH%.zip"
set "KB_DIR=%PYDIR%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $zip=Join-Path $env:TEMP 'klikband-python.zip'; Invoke-WebRequest -UseBasicParsing $env:KB_URL -OutFile $zip; Expand-Archive -Force $zip $env:KB_DIR; Remove-Item $zip"
if errorlevel 1 goto failed
if not exist "%PYDIR%\python.exe" goto failed
echo.

:embedded
"%PYDIR%\python.exe" -I "%HERE%auth_key.py"
goto done

:launcher
py -3 -I "%HERE%auth_key.py"
goto done

:unzipped
echo File auth_key.py tidak ditemukan.
echo Ekstrak dulu zip-nya (klik kanan, Extract All), lalu buka "KlikBand Auth Key.bat" dari folder hasil ekstrak.
goto done

:failed
echo Gagal menyiapkan Python. Periksa koneksi internet, lalu coba lagi.

:done
echo.
pause

@echo off
echo Stopping Akadal Chain Educational Blockchain Environment...

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Stop the system
echo Stopping containers...
docker-compose down

echo.
echo Akadal Chain has been stopped.
echo.
echo To start the system again, run: start.bat
echo. 